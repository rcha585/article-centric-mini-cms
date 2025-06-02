package gui;

import javax.swing.*;

import java.awt.*;

/**
 * A simple JFrame that can be initialized to a given size in its constructor, and displays a single {@link AdminPanel}.
 */
public class Main extends JFrame {

    /**
     * Creates a new ExerciseOneFrame
     *
     * @param title the title of the frame
     * @param x the position of the left side of the frame
     * @param y the position of the top of the frame
     * @param width the width of the frame
     * @param height the height of the frame
     */
    public Main(String title, int x, int y, int width, int height) {
        setTitle(title);
        setBounds(x, y, width, height);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        AdminPanel frameContent = new AdminPanel();
        Container visibleArea = getContentPane();

        visibleArea.add(frameContent);
    }

    /**
     * Program entry point.
     */
    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                // x and y is to compare to your computer screen
                Main frame = new Main("Administration Panel", 600, 200, 400, 400);
                frame.setVisible(true);
            }
        });
    }

}
