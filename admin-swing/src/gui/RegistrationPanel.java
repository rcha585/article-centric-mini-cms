package gui;

import javax.swing.*;
import java.awt.*;

/**
 * A JPanel for the admin to sign in.
 */
public class RegistrationPanel extends JPanel {

    public JTextField usernameTextField;
    public JTextField passwordTextField;
    public JButton loginButton;
    public JButton logoutButton;

    protected static String userName;
    protected static String userPassWord;

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

    }

    public JButton getLoginButton() {
        return loginButton;
    }

    public JButton getLogoutButton() {
        return logoutButton;
    }

    public String getUsername() {
        userName = usernameTextField.getText();
        return userName;
    }

    public String getPassword() {
        userPassWord = passwordTextField.getText();
        return userPassWord;
    }

}
