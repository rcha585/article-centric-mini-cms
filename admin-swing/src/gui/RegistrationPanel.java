package gui;

import javax.swing.*;

import controller.ButtonListener;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;

import java.util.List;
import util.HttpHelper;
import model.SingleUserData;


/**
 * A simple GUI app that does BMI calculations.
 */
public class RegistrationPanel extends JPanel implements ActionListener {

    // TODO Declare JTextFields and JButtons as instance variables here.
    public JTextField usernameTextField;
    public JTextField passwordTextField;
    public JButton loginButton;
    public JButton logoutButton;

    protected static String userName;
    protected static String userPassWord;
    public JLabel loginStatusLabel = new JLabel();
    private ButtonListener loginListener;
    protected static List<SingleUserData> usersData;

    /**
     * Creates a new ExerciseOnePanel.
     */
    public RegistrationPanel() {
        setBackground(Color.white);
        setLayout(new GridBagLayout());

        // TODO Construct JTextFields and JButtons.
        // HINT: Declare them as instance variables so that other methods in this class (e.g. actionPerformed) can
        // also access them.

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);

        gbc.gridx = 1;
        gbc.gridy = 0;
        // JLabel loginStatusLabel = new JLabel("");
        this.add(loginStatusLabel,gbc);

        // username
        gbc.gridx = 0;
        gbc.gridy = 1;
        // gbc.anchor = GridBagConstraints.EAST;
        JLabel usernameLabel = new JLabel("username");
        this.add(usernameLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        // gbc.anchor = GridBagConstraints.WEST;
        usernameTextField = new JTextField(15); //check with Daoli about validation
        this.add(usernameTextField, gbc);

        // password
        gbc.gridx = 0;
        gbc.gridy = 2;
        // gbc.anchor = GridBagConstraints.EAST;
        JLabel passwordLabel = new JLabel("password");
        this.add(passwordLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 2;
        // gbc.anchor = GridBagConstraints.WEST;
        passwordTextField = new JTextField(15); //check with Daoli about validation
        this.add(passwordTextField, gbc);

        gbc.anchor = GridBagConstraints.WEST;

        gbc.gridx = 0;
        gbc.gridy = 3;
        loginButton = new JButton("Login");
        this.add(loginButton, gbc);

        gbc.gridx = 1;
        gbc.gridy = 3;
        logoutButton = new JButton("Logout");
        logoutButton.setEnabled(false);
        this.add(logoutButton, gbc);


        // TODO Declare and construct JLabels
        // Note: These ones don't need to be accessed anywhere else so it makes sense just to declare them here as
        // local variables, rather than instance variables.

        // TODO Add JLabels, JTextFields and JButtons to window.
        // Note: The default layout manager, FlowLayout, will be fine (but feel free to experiment with others if you want!!)


        // TODO Add Action Listeners for the JButtons
//        this.calculateBMIButton.setEnabled(false);
        this.loginButton.addActionListener(this);
        this.logoutButton.addActionListener(this);
    }

    public void setLoginListener(ButtonListener listener) {
        this.loginListener = listener;
    }
    /**
     * When a button is clicked, this method should detect which button was clicked, and display either the BMI or the
     * maximum healthy weight, depending on which JButton was pressed.
     */
        @Override
        public void actionPerformed(ActionEvent event) {
            // Your handling code here
            userName = usernameTextField.getText();
            userPassWord = passwordTextField.getText();

            int isAdmin = 0;
            if (event.getSource() == loginButton) {
                try {
                    isAdmin = HttpHelper.checkUserIsAdmin(userName, userPassWord);
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                }

                if (isAdmin == 1) {
                    try {
                        String json = HttpHelper.getAllUserData(RegistrationPanel.userName, RegistrationPanel.userPassWord);
                        usersData = JsonManualParser.parseUsers(json);
                        System.out.println(usersData);

                         // Notify MainFrame
                        if (loginListener != null) {
                            loginListener.isLoginSuccess(usersData);
                        }

                    } catch (IOException | InterruptedException e) {
                        e.printStackTrace();
                    }
                    // System.out.println("Raw GET response: " + json);
                    if (loginListener != null) {
                        loginListener.isLoginSuccess(usersData);
                    }
                    logoutButton.setEnabled(true);
                    loginButton.setEnabled(false);
                    loginStatusLabel.setText("");
                    usernameTextField.setText("");
                    passwordTextField.setText("");
                }
                else {
                    loginStatusLabel.setText("Unauthorized Loggin, Please try again");
                }
            }

            if (event.getSource() == logoutButton) {
                try {
                    HttpHelper.sendLogoutRequest();
                    logoutButton.setEnabled(false);
                    loginButton.setEnabled(true);

                    // Notify MainFrame about logout
                    if (loginListener != null) {
                        loginListener.clickLogout();  // NEW
                    }

                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                }
            }


        }

        public static List<SingleUserData> getUsersData() {
            return usersData;
        }

        public void setLoginListener(Object listener) {
        }

//     /**
//      * A library method that rounds a double to 2dp
//      *
//      * @param amount to round as a double
//      * @return the amount rounded to 2dp
//      */
//     private double roundTo2DecimalPlaces(double amount) {
//         return ((double) Math.round(amount * 100)) / 100;
//     }

}
