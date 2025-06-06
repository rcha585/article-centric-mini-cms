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

        JLabel usernameLabel = new JLabel("Username: " + user.userName);
        JLabel realnameLabel = new JLabel("Realname: " + user.firstName +" "+ user.lastName);
        JLabel dobLabel = new JLabel("DOB: " + user.dateOfBirth);
        JLabel descriptionLabel = new JLabel("Description: " + user.description);

        // frontend/static/avatars/favicon.png
        String avatar_url = "frontend/static/"+user.avatarPath;
        System.out.println(avatar_url);
        ImageIcon avatar = new ImageIcon(avatar_url);
        if (avatar.getIconWidth() == -1) {
            avatar = new ImageIcon("fallback.png");
        }
        JLabel avatarLabel = new JLabel(avatar);
        avatarLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        usernameLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        realnameLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        dobLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        descriptionLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        panel.add(avatarLabel);
        panel.add(Box.createVerticalStrut(10));
        panel.add(usernameLabel);
        panel.add(realnameLabel);
        panel.add(dobLabel);
        panel.add(descriptionLabel);

        add(panel);

        setVisible(true);
    
    }
}
