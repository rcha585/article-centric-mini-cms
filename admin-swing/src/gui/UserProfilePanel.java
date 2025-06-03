package gui;

import javax.swing.*;
import java.awt.*;
import model.SingleUserData;

public class UserProfilePanel extends JFrame {


    public UserProfilePanel(SingleUserData user, Component relativeTo) {
        super("User Profile: " + user.userName);
    
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(300, 400);

        // Position the window slightly offset from the relative component
        if (relativeTo != null) {
            Point loc = relativeTo.getLocationOnScreen();
            setLocation(loc.x + 350, loc.y);
        } else {
            setLocationRelativeTo(null);
        }

        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JLabel nameLabel = new JLabel("Name: " + user.userName);
        JLabel dobLabel = new JLabel("DOB: " + user.dateOfBirth);

        ImageIcon avatar = new ImageIcon(user.avatarPath);
        if (avatar.getIconWidth() == -1) {
            avatar = new ImageIcon("fallback.png");
        }
        JLabel avatarLabel = new JLabel(avatar);
        avatarLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        nameLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        dobLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        panel.add(avatarLabel);
        panel.add(Box.createVerticalStrut(10));
        panel.add(nameLabel);
        panel.add(dobLabel);

        add(panel);

        setVisible(true);
    
    }
}
