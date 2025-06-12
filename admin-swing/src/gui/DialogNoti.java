package gui;
import javax.swing.*;
import java.awt.*;
import javax.swing.JLabel;

/**
 * Pop up DialogNoti if admin doesn't enter valid username or password
 */
public class DialogNoti extends JDialog {

    public DialogNoti(JFrame parent) {
        super(parent, "Invalid Registration", true); // true = modal

        setLayout(new BorderLayout());
        JLabel label = new JLabel("Invalid login, please try again.", SwingConstants.CENTER);
        add(label, BorderLayout.CENTER);
        JButton closeBtn = new JButton("Close");
        closeBtn.addActionListener(e -> dispose()); // Close dialog
        add(closeBtn, BorderLayout.SOUTH);

        setSize(250, 150);
        setLocationRelativeTo(parent);
    }
}
