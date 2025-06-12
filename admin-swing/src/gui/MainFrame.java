package gui;

import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.io.IOException;
import java.awt.Component;
import java.awt.Dimension;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import javax.management.relation.RelationSupport;
import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import javax.swing.SwingUtilities;
import javax.swing.SwingWorker;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;

import model.AllUserData;
import model.SingleUserData;
import util.HttpHelper;
import controller.ButtonListener;

/**
 * An application which has been designed according to Swing's model/view
 * architecture, this application is for the admin to see user data and delete user account
 * 
 */
public class MainFrame extends JFrame {

    /* Main model for this application. */
	private AllUserData userInfo;

	// store selected userID
	private SingleUserData selectedUser;

	// build table by using table model adapter 
	private UserTablePanel<Object> tableModel;

	// a delete button to delete user data
	public JButton deleteButton = new JButton("Delete Selected User");
	
	// a main JPanel to add registration panel, user table data panel and delete panel
	public JPanel mainPane = new JPanel();

	// a seperate JFrame to display each user profile
	private UserProfilePanel currentUserProfile = null;



    public MainFrame() {
        super("Administration Panel");

        /* Create application's model. */
        userInfo = new AllUserData();

        /* Load model data in the background. */
		Worker worker = new Worker();
		worker.execute();

        /**********************************************************************
		 * - Instantiate view components: 
		 * - Instantiate adapter, create row selection listener for the adapter
		 * - Wire-up (connect) objects.
		 */

        /* View components. */
		RegistrationPanel registrationPanel = new RegistrationPanel();
		registrationPanel.setPreferredSize(new Dimension(800, 200));
        JTable tableView = new JTable(); 
        
        /* Adapters. */
		// Step 1: Instantiate adapter
		tableModel = new UserTablePanel<>(userInfo);
        tableView.setModel(tableModel);
        
		// Step 2: choose row selection listener (ListSelectionListener) for tableView -
		// a specific interface used to listen for selection changes in components like JList or JTable.
		
		// Step 2.1: limit only 1 row can be selected at a time to control selection behavior
        tableView.setSelectionMode(ListSelectionModel.SINGLE_SELECTION); 

		// Step 2.2: getSelectionModel() returns which row is selected and attach addListSelectionListener
		// to that row so we know when user selects or changes the selected row
        tableView.getSelectionModel().addListSelectionListener(new ListSelectionListener() {
            @Override
            public void valueChanged(ListSelectionEvent e) {
                if (!e.getValueIsAdjusting()) {
                    int selectedRow = tableView.getSelectedRow();
                    if (selectedRow != -1) //Returns the index of the first selected row, -1 if no row is selected.
					{

                        // If table sorting is enabled, convert to model index
                        int modelIndex = tableView.convertRowIndexToModel(selectedRow);
                        selectedUser = userInfo.getDataAt(modelIndex);
                        System.out.println("Selected User ID: " + selectedUser.userID);

                       // Dispose old window if it exists
						if (currentUserProfile != null) {
							currentUserProfile.dispose();
						}
						// Create and show new UserProfilePanel window
						currentUserProfile = new UserProfilePanel(selectedUser, mainPane);

						deleteButton.setEnabled(true);
                    }
					else {
						selectedUser = null;
						deleteButton.setEnabled(false);
					}
                }
            }
        });

		// Set listener to respond when login/logout is successful
		registrationPanel.setLoginListener(new ButtonListener() {
			@Override
			public void isLoginSuccess(List<SingleUserData> data) {
				for (SingleUserData user : data) {
					userInfo.addUserData(user);
				}
				tableModel.fireTableDataChanged(); //refresh data once log in, notifies all listeners that all cell values in the table's rows have changed
			}
		
			@Override
			public void clickLogout() {
				userInfo.clear(); // model clears and notifies the table
				
				// dispose user profile when logout
				if (currentUserProfile != null) {
					currentUserProfile.dispose();
					currentUserProfile = null;
				}
			}
		});
		

        // Construct the GUI in the ED thread.
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				buildGUI(registrationPanel,tableView);
			}
		});
    }

    /*
	 * Builds the GUI.
	 */
    private void buildGUI(RegistrationPanel registrationView,JTable userDataView) {
		/*
		 * Create a Panel to combine the distribution and statistics visual
		 * representations.
            */
		JPanel top = new JPanel();
		top.setBorder(BorderFactory
				.createTitledBorder("User Register"));
		top.setLayout(new BoxLayout(top, BoxLayout.Y_AXIS));
		top.add(registrationView);
		top.add(Box.createRigidArea(new Dimension(10, 0)));
		// right.add(statisticsView);



        JPanel bottom = new JPanel();
        bottom.setBorder(BorderFactory.createTitledBorder("All User Data"));
        bottom.setLayout(new BoxLayout(bottom, BoxLayout.Y_AXIS));
        JScrollPane scrollPane = new JScrollPane(userDataView);
        bottom.add(scrollPane);
        bottom.add(Box.createRigidArea(new Dimension(10, 0)));

		JPanel deletePanel = new JPanel();
		// JButton deleteButton = new JButton("Delete Selected User");
		deleteButton.setEnabled(false);
		deletePanel.add(deleteButton);

		deleteButton.addActionListener(e -> {
			if (selectedUser != null) {
				int selectedUserID = selectedUser.getUserID();
				userInfo.removeUserByID(selectedUserID);
				System.out.println(selectedUserID);
				// to add a HTML to delete user from the database
				try {
					HttpHelper.sendDeleteRequest(selectedUserID);
				} catch (IOException | InterruptedException e1) {
					e1.printStackTrace();
				}

				selectedUser = null; // Clear reference
				tableModel.fireTableDataChanged(); // Refresh table

				currentUserProfile.dispose();

			} else {
				// JOptionPane.showMessageDialog(MainFrame.this, "Please select a row to delete.");
			}
		});

        /* Create main pane for the application. */
		// JPanel mainPane = new JPanel();
		mainPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
		mainPane.setLayout(new BoxLayout(mainPane, BoxLayout.Y_AXIS));
		mainPane.add(top);
		mainPane.add(Box.createRigidArea(new Dimension(10, 0)));
		mainPane.add(bottom);
		mainPane.add(deletePanel);

		add(mainPane);


        /* Quit the program in response to the user closing the window. */
        addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				System.exit(0);
			}
		});

		pack();
		// setLocationRelativeTo(null);
		setResizable(false);
		setVisible(true);
        
        }

    /**
	 * Runs the application.
	 */
	public static void main(String[] args) {
		// new MainFrame();
		MainFrame frame = new MainFrame();
		frame.setLocation(20, 100);// Move frame to left so we can let UserProfilePanel appear on the right
		frame.setVisible(true); 
		
	}

    /*
	 * Nested inner class to load Course data from file using a separate thread.
	 */
	private class Worker extends SwingWorker<List<SingleUserData>, Void> {

		@Override
		protected List<SingleUserData> doInBackground() {
			List<SingleUserData> data = RegistrationPanel.getUsersData();
			System.out.println(data);
			return data;
		}

		@Override
		protected void done() {
			try {
				List<SingleUserData> data = get();
		
				if (data == null || data.isEmpty()) {
					// JOptionPane.showMessageDialog(
					// 	MainFrame.this,
					// 	"Unable to load user data. You may not be authorized or the data is missing.",
					// 	"Load Warning",
					// 	JOptionPane.WARNING_MESSAGE
					// );
					return;
				}
		
				// Only loop if data is valid
				for (SingleUserData result : data) {
					userInfo.addUserData(result);
				}
		
			} catch (InterruptedException | ExecutionException e) {
				e.printStackTrace();
				JOptionPane.showMessageDialog(
					MainFrame.this,
					"An error occurred while loading user data:\n" + e.getCause(),
					"Load Error",
					JOptionPane.ERROR_MESSAGE
				);
			}
		}
	}
}
