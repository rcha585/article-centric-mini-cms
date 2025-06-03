package gui;

import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.Dimension;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.SwingUtilities;
import javax.swing.SwingWorker;

import model.AllUserData;
import model.SingleUserData;
import util.HttpHelper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MainFrame extends JFrame {

    /* Main model for this application. */
	private AllUserData userInfo;

    public MainFrame() {
        super("Administration Panel");

        /* Create application's model. */
        userInfo = new AllUserData();

        /* Load model data in the background. */
		Worker worker = new Worker();
		worker.execute();

        /**********************************************************************
		 * - Instantiate view classes.
		 * - Instantiate adapters.
		 * - Wire-up (connect) objects.
		 */

        /* View components. */
		RegistrationPanel frameContent = new RegistrationPanel();
        JTable tableView = new JTable(); 
        
        /* Adapters. */
        UserTablePanel tableModel = new UserTablePanel<>(userInfo);
        tableView.setModel(tableModel);
        

        // Construct the GUI in the ED thread.
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				buildGUI(frameContent,tableView);
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
		JPanel left = new JPanel();
		left.setBorder(BorderFactory
				.createTitledBorder("User Register"));
		left.setLayout(new BoxLayout(left, BoxLayout.Y_AXIS));
		left.add(registrationView);
		left.add(Box.createRigidArea(new Dimension(10, 0)));
		// right.add(statisticsView);



        JPanel right = new JPanel();
        right.setBorder(BorderFactory.createTitledBorder("All User Data"));
        right.setLayout(new BoxLayout(right, BoxLayout.Y_AXIS));
        JScrollPane scrollPane = new JScrollPane(userDataView);
        right.add(scrollPane);
        right.add(Box.createRigidArea(new Dimension(10, 0)));

        /* Create main pane for the application. */
		JPanel mainPane = new JPanel();
		mainPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
		mainPane.setLayout(new BoxLayout(mainPane, BoxLayout.X_AXIS));
		mainPane.add(left);
		mainPane.add(Box.createRigidArea(new Dimension(10, 0)));
		mainPane.add(right);

		add(mainPane);


        /* Quit the program in response to the user closing the window. */
        addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				System.exit(0);
			}
		});

		pack();
		setLocationRelativeTo(null);
		setResizable(false);
		setVisible(true);
        
        }

        /**
	 * Runs the application.
	 */
	public static void main(String[] args) {
		new MainFrame();
	}

    /*
	 * Nested inner class to load Course data from file using a separate thread.
	 */
	private class Worker extends SwingWorker<List<SingleUserData>, Void> {

		@Override
		protected List<SingleUserData> doInBackground() {
			try {
                // Call the method to get the JSON string
                String json = HttpHelper.sendPostThenGet("http://localhost:3000/api/auth/login", "http://localhost:3000/api/users?username=paige_phan");
                // System.out.println("Raw GET response: " + json);
				List<SingleUserData> data = JsonManualParser.parseUsers(json);
			
                // Parse JSON string to List<StudentResult>
                // ObjectMapper mapper = new ObjectMapper();
                // List<SingleUserData> data = mapper.readValue(json, new TypeReference<List<SingleUserData>>() {});
        
                System.out.println("check: " + data);
                return data;
        
            } catch (Exception e) {
                e.printStackTrace();
                return List.of(); // return empty list on failure
            }
		}

		@Override
		protected void done() {
			List<SingleUserData> data;
			try {
				data = get();

				if (data == null) {
					// No data loaded.
					JOptionPane
							.showMessageDialog(
									MainFrame.this,
									"Unable to load student results. The data file is empty, missing or corrupt. \nUse modelview.admin.CourseDataManager to (re)create the data file.",
									"Load error", JOptionPane.WARNING_MESSAGE);
				} else {
					// Populate the Course model object with the loaded data.
					for (SingleUserData result : data) {
						userInfo.addUserData(result);
					}
				}
			} catch (InterruptedException | ExecutionException e) {
				e.printStackTrace();
			}
		}
	}
}
