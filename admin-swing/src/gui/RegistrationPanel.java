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
 * A JPanel for the admin to sign in.
 */
public class RegistrationPanel extends JPanel implements ActionListener {

    // TODO Declare JTextFields and JButtons as instance variables here.
    public JTextField usernameTextField;
    public JTextField passwordTextField;
    public JButton loginButton;
    public JButton logoutButton;

    protected static String userName;
    protected static String userPassWord;
    private ButtonListener loginListener;
    protected static List<SingleUserData> usersData;

    /**
     * Creates a new RegistrationPanel.
     */
    public RegistrationPanel() {
        setBackground(Color.white);
        setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);

        //1. username label and text field
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel usernameLabel = new JLabel("username");
        this.add(usernameLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        usernameTextField = new JTextField(15); 
        this.add(usernameTextField, gbc);

        //2. password label and text field
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel passwordLabel = new JLabel("password");
        this.add(passwordLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 2;
        passwordTextField = new JTextField(15); 
        this.add(passwordTextField, gbc);

        gbc.anchor = GridBagConstraints.WEST;

        //3. Login button
        gbc.gridx = 0;
        gbc.gridy = 3;
        loginButton = new JButton("Login");
        this.add(loginButton, gbc);

        //3. Logout button
        gbc.gridx = 1;
        gbc.gridy = 3;
        logoutButton = new JButton("Logout");
        logoutButton.setEnabled(false);
        this.add(logoutButton, gbc);

        // Add Action Listeners for the JButtons
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
                    // loginStatusLabel.setText("");
                    usernameTextField.setText("");
                    passwordTextField.setText("");
                }
                else {
                    JDialogNoti dialogNoti = new JDialogNoti(null);
                    dialogNoti.setVisible(true);

                    // After dialog closes, update login status label
                    // loginStatusLabel.setText("Unauthorized login, please try again.");
                    // loginStatusLabel.setText("Unauthorized Loggin, Please try again");
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

}
