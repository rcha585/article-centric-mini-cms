package gui;

import javax.swing.*;
import java.awt.*;
import model.SingleUserData;

public class UserProfilePanel extends JFrame {


    public UserProfilePanel(SingleUserData user, Component relativeTo) {
        super("User Profile: " + user.userName);
    
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(500, 500);

        // 1. Position the window slightly offset from the relative component
        if (relativeTo != null) {
            Point loc = relativeTo.getLocationOnScreen();
            setLocation(loc.x + 900, loc.y);
        } else {
            setLocationRelativeTo(null);
        }

        // 2. create details label
        JLabel usernameLabel = new JLabel("Username: " + user.userName);
        JLabel realnameLabel = new JLabel("Realname: " + user.firstName +" "+ user.lastName);
        JLabel dobLabel = new JLabel("DOB: " + user.dateOfBirth);
        JTextArea descriptionArea = new JTextArea("Description: " + user.description); // useJTextArea and add scroll in case description is long
        descriptionArea.setEditable(false);
        descriptionArea.setLineWrap(true);          
        descriptionArea.setWrapStyleWord(true);
        descriptionArea.setAlignmentX(Component.CENTER_ALIGNMENT);
        descriptionArea.setFocusable(false);    
        JScrollPane scrollPane = new JScrollPane(descriptionArea, JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED,JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        scrollPane.setPreferredSize(new Dimension(300, 100));


        // 3. load and resize avatar
        String avatar_url = "frontend/static/"+user.avatarPath;
        System.out.println(avatar_url);
        ImageIcon originalIcon = new ImageIcon(avatar_url);
        Image originalImage = originalIcon.getImage();
        Image resizedImage = originalImage.getScaledInstance(200, 200, Image.SCALE_SMOOTH);
        ImageIcon avatar = new ImageIcon(resizedImage);
        if (avatar.getIconWidth() == -1) {
            avatar = new ImageIcon("fallback.png");
        }
        JLabel avatarLabel = new JLabel(avatar);
        
        // 4. Create detailsPanel to wrap everything vertically
        // 4.1. Create detailsPanel
        JPanel detailsPanel = new JPanel();
        detailsPanel.setLayout(new BoxLayout(detailsPanel, BoxLayout.Y_AXIS));

        // 4.2. all components center align inside detailsPanel
        avatarLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        usernameLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        realnameLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        dobLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        // 4.3. Add to detailsPanel
        detailsPanel.add(avatarLabel);
        detailsPanel.add(usernameLabel);
        detailsPanel.add(realnameLabel);
        detailsPanel.add(dobLabel);
        detailsPanel.add(scrollPane);

        // 5. Create mainPanel to add detailsPanel and center it
        JPanel mainPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.CENTER;

        mainPanel.add(detailsPanel, gbc);

        add(mainPanel);

        setVisible(true);
    
    }
}
