package gui;
import javax.swing.*;
import java.awt.*;
import javax.swing.JLabel;

public class JDialogNoti extends JDialog {

    public JDialogNoti(JFrame parent) {
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
