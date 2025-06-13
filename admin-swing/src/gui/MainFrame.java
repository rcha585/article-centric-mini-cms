package gui;

import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;
import java.awt.Dimension;
import java.util.ArrayList;
import java.util.List;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JFrame;
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

/**
 * An application which has been designed according to Swing's model/view
 * architecture, this application is for the admin to see user data and delete
 * user account
 * 
 */
public class MainFrame extends JFrame {

	/* Main model for this application. */
	private AllUserData userInfo;

	List<SingleUserData> usersData;

	// store selected userID
	private SingleUserData selectedUser;

	// build table by using table model adapter
	private UserTableModel<Object> tableModel;

	// a delete button to delete user data
	public JButton deleteButton = new JButton("Delete Selected User");

	// a main JPanel to add registration panel, user table data panel and delete
	// panel
	public JPanel mainPane = new JPanel();

	// a seperate JFrame to display each user profile
	private UserProfileFrame currentUserProfile = null;

	protected static String userName;
	protected static String userPassWord;

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
		tableModel = new UserTableModel<>(userInfo);
		tableView.setModel(tableModel);

		// Construct the GUI in the ED thread.
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				buildGUI(registrationPanel, tableView);
			}
		});
	}

	/*
	 * Builds the GUI.
	 */
	private void buildGUI(RegistrationPanel registrationView, JTable userDataView) {

		// -------------------- CREATE A MAIN PANE --------------------
		/*
		 * Create a mainPane (4) to combine:
		 * 1) registrationPanel (located at the top)
		 * 2) user table (located at the middle)
		 * 3) delete button(Panel) (located at the bottom)
		 */

		/* 1) registrationPanel (located at the top) */
		JPanel top = new JPanel();
		top.setBorder(BorderFactory
				.createTitledBorder("User Register"));
		top.setLayout(new BoxLayout(top, BoxLayout.Y_AXIS));
		top.add(registrationView);
		top.add(Box.createRigidArea(new Dimension(10, 0)));

		/* 2) user table (located at the middle) */
		JPanel middle = new JPanel();
		middle.setBorder(BorderFactory.createTitledBorder("All User Data"));
		middle.setLayout(new BoxLayout(middle, BoxLayout.Y_AXIS));
		JScrollPane scrollPane = new JScrollPane(userDataView);
		middle.add(scrollPane);
		middle.add(Box.createRigidArea(new Dimension(10, 0)));

		/* 3) delete button(Panel) (located at the bottom) */
		JPanel bottom = new JPanel();
		deleteButton.setEnabled(false);
		bottom.add(deleteButton);

		/* 4) Create main pane for the application. */
		mainPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
		mainPane.setLayout(new BoxLayout(mainPane, BoxLayout.Y_AXIS));
		mainPane.add(top);
		mainPane.add(Box.createRigidArea(new Dimension(10, 0)));
		mainPane.add(middle);
		mainPane.add(bottom);

		add(mainPane);

		// -------------------- CREATE A MAIN PANE --------------------
		/*
		 * Create Listener:
		 * 1) ActionListner for registrationPanel (login and logout logic)
		 * 2) ListSelectionListener for usertableModel (row selection logic)
		 * 3) ActionListner for delete user data
		 */

		/* 1) ActionListner for registrationPanel */
		/* 1a) ActionListner for login */
		registrationView.getLoginButton().addActionListener(e -> {
			int isAdmin = 0;
			try {
				isAdmin = HttpHelper.checkUserIsAdmin(registrationView.getUsername(), registrationView.getPassword());
			} catch (IOException | InterruptedException error) {
				error.printStackTrace();
			}

			// if login sucessfully
			// => return user data and create JTable data
			// => enable logout, disable login + username/password TextField and reset
			// TextField
			// if login fail => a dialog pop up
			if (isAdmin == 1) {
				try {
					String json = HttpHelper.getAllUserData(registrationView.getUsername(),
							registrationView.getPassword());
					usersData = JsonManualParser.parseUsers(json);
					for (SingleUserData user : usersData) {
						userInfo.addUserData(user);
					}

				} catch (IOException | InterruptedException error) {
					error.printStackTrace();
				}
				tableModel.fireTableDataChanged();
				registrationView.logoutButton.setEnabled(true);
				registrationView.loginButton.setEnabled(false);
				registrationView.usernameTextField.setEnabled(false);
				registrationView.passwordTextField.setEnabled(false);
				userName = registrationView.usernameTextField.getText();
				userPassWord = registrationView.passwordTextField.getText();
				registrationView.usernameTextField.setText("");
				registrationView.passwordTextField.setText("");
			} else {
				DialogNoti dialogNoti = new DialogNoti(null);
				dialogNoti.setVisible(true);
			}
		});

		/* 1b) ActionListner for logout */
		// logout -> disable logout button, enable login button + username/password
		// TextField
		registrationView.getLogoutButton().addActionListener(e -> {
			try {
				HttpHelper.sendLogoutRequest();
				registrationView.logoutButton.setEnabled(false);
				registrationView.loginButton.setEnabled(true);
				registrationView.usernameTextField.setEnabled(true);
				registrationView.passwordTextField.setEnabled(true);

			} catch (IOException | InterruptedException error) {
				error.printStackTrace();
			}
			userInfo.clear(); // model clears and notifies the table
			tableModel.fireTableDataChanged();
			// dispose user profile when logout
			if (currentUserProfile != null) {
				currentUserProfile.dispose();
				currentUserProfile = null;
			}

			deleteButton.setEnabled(false);
		});

		/* 2) ListSelectionListener for usertableModel (row selection logic) */
		// choose row selection listener (ListSelectionListener) for tableView -
		// a specific interface used to listen for selection changes in components like
		// JList or JTable.

		// Step 2.1: limit only 1 row can be selected at a time to control selection
		// behavior
		userDataView.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

		// Step 2.2: getSelectionModel() returns which row is selected and attach
		// addListSelectionListener
		// to that row so we know when user selects or changes the selected row
		userDataView.getSelectionModel().addListSelectionListener(new ListSelectionListener() {
			@Override
			public void valueChanged(ListSelectionEvent e) {
				if (!e.getValueIsAdjusting()) {
					int selectedRow = userDataView.getSelectedRow();
					if (selectedRow != -1) // Returns the index of the first selected row, -1 if no row is selected.
					{
						// If table sorting is enabled, convert to model index
						int modelIndex = userDataView.convertRowIndexToModel(selectedRow);
						selectedUser = userInfo.getDataAt(modelIndex);
						System.out.println("Selected User ID: " + selectedUser.userID);

						// Dispose old window if it exists
						if (selectedUser == null || currentUserProfile != null) {
							currentUserProfile.dispose();
						}

						// Create and show new UserProfilePanel window
						currentUserProfile = new UserProfileFrame(selectedUser, mainPane);

						deleteButton.setEnabled(true);
					} else {
						deleteButton.setEnabled(false);
					}
				}
			}
		});

		/* 3) ActionListner for delete user data */
		deleteButton.addActionListener(e -> {
			if (selectedUser != null) {
				int selectedUserID = selectedUser.getUserID();
				System.out.println("Delete UserID: " + selectedUserID);
				try {
					HttpHelper.sendDeleteRequest(selectedUserID);
					String json = HttpHelper.getAllUserData(userName, userPassWord);
					usersData = JsonManualParser.parseUsers(json);
					userInfo.clear(); // clear all data
					for (SingleUserData user : usersData) {
						userInfo.addUserData(user);
					}

					selectedUser = null; // Clear reference
					tableModel.fireTableDataChanged(); // Refresh table

					currentUserProfile.dispose();
				} catch (IOException | InterruptedException e1) {
					e1.printStackTrace();
				}
			}
		});

		/* Quit the program in response to the user closing the window. */
		addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				System.exit(0);
			}
		});

		pack();
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
	 * For update user table if user info is newly added/deleted or updated
	 */
	private class Worker extends SwingWorker<Void, List<SingleUserData>> {

		@Override
		protected Void doInBackground() throws Exception {
			while (true) {
				Thread.sleep(1000); // Check every second
				String json = HttpHelper.getAllUserData(userName, userPassWord);
				List<SingleUserData> latestUsersData = JsonManualParser.parseUsers(json);
				// if latest usersData from db is different from the current data from user table panel 
				if (!latestUsersData.equals(usersData) && !latestUsersData.isEmpty() && latestUsersData.get(0).userID != 0) {
					publish(latestUsersData); // Send to process()
					usersData = new ArrayList<>(latestUsersData);
					}
				}
		}

		@Override
		protected void process(List<List<SingleUserData>> publishedUsersData) {

			// Refresh user table in the main frame
			List<SingleUserData> latestUsersData = publishedUsersData.get(publishedUsersData.size() - 1);
			userInfo.clear(); // Clear old data
			for (SingleUserData user : latestUsersData) {
				userInfo.addUserData(user); // Re-add fresh data
			}
			tableModel.fireTableDataChanged(); // Refresh data table

			// Refresh user profile frame
			if (currentUserProfile != null && selectedUser != null) {
				// Get the updated version of selectedUser
				for (SingleUserData user : latestUsersData) {
					System.out.println("Updating user profile for ID: " + user.userID);
					if (user.userID == selectedUser.userID) {
						selectedUser = user;
						currentUserProfile.updateUser(user);
						break;
					}
				}
			}
		}
	}
}
