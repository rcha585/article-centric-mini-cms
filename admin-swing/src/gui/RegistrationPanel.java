package gui;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * A simple GUI app that does BMI calculations.
 */
public class RegistrationPanel extends JPanel implements ActionListener {

    // TODO Declare JTextFields and JButtons as instance variables here.
    public JTextField usernameTextField;
    public JTextField passwordTextField;
    public JButton loginButton;
    public JButton logoutButton;

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

        // username
        gbc.gridx = 0;
        gbc.gridy = 0;
        // gbc.anchor = GridBagConstraints.EAST;
        JLabel usernameLabel = new JLabel("username");
        this.add(usernameLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 0;
        // gbc.anchor = GridBagConstraints.WEST;
        usernameTextField = new JTextField(15); //check with Daoli about validation
        this.add(usernameTextField, gbc);

        // password
        gbc.gridx = 0;
        gbc.gridy = 1;
        // gbc.anchor = GridBagConstraints.EAST;
        JLabel passwordLabel = new JLabel("password");
        this.add(passwordLabel, gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        // gbc.anchor = GridBagConstraints.WEST;
        passwordTextField = new JTextField(15); //check with Daoli about validation
        this.add(passwordTextField, gbc);

        gbc.anchor = GridBagConstraints.WEST;

        gbc.gridx = 0;
        gbc.gridy = 2;
        loginButton = new JButton("Login");
        this.add(loginButton, gbc);

        gbc.gridx = 1;
        gbc.gridy = 2;
        logoutButton = new JButton("Logout");
        this.add(logoutButton, gbc);


        // TODO Declare and construct JLabels
        // Note: These ones don't need to be accessed anywhere else so it makes sense just to declare them here as
        // local variables, rather than instance variables.

        // TODO Add JLabels, JTextFields and JButtons to window.
        // Note: The default layout manager, FlowLayout, will be fine (but feel free to experiment with others if you want!!)


        // TODO Add Action Listeners for the JButtons
//        this.calculateBMIButton.setEnabled(false);
        // this.loginButton.addActionListener(this);
        // this.logoutButton.addActionListener(this);
    }


//     /**
//      * When a button is clicked, this method should detect which button was clicked, and display either the BMI or the
//      * maximum healthy weight, depending on which JButton was pressed.
//      */
//     public void actionPerformed(ActionEvent event) {

//         // TODO Implement this method.
//         // Hint #1: event.getSource() will return the button which was pressed.
//         // Hint #2: JTextField's getText() method will get the value in the text box, as a String.
//         // Hint #3: JTextField's setText() method will allow you to pass it a String, which will be diaplayed in the text box.
//         double height = Double.parseDouble(heightTextField.getText());
//         double weight = Double.parseDouble(weightTextField.getText());
//         if (event.getSource() == calculateBMIButton) {
//             double bmi = weight / (height * height);
//             String bmiString = String.valueOf(roundTo2DecimalPlaces(bmi));
//             bmiTextField.setText(bmiString);
//         }
//         else if (event.getSource() == calculateHealthyWeightButton) {
//             double healthyWeight = 24.9 * height * height;
//             String healthyWeightString = String.valueOf(roundTo2DecimalPlaces(healthyWeight));
//             healthyWeightTextField.setText(healthyWeightString);
//         }

//     }

        @Override
        public void actionPerformed(ActionEvent e) {
            // Your handling code here
            String userName = usernameTextField.getText();
            String userPassword = passwordTextField.getText();

            

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
