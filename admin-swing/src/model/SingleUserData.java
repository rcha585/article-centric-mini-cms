package model;

import java.util.Objects;

/**
 * One User Data
 */
public class SingleUserData {

    public final int userID;
    public final String userName;
    public final String firstName;
    public final String lastName;
    public final String dateOfBirth;
    public final String description;
    public final String avatarPath;

    public SingleUserData(int userID, String userName, String lastName, String firstName,
            String avatarPath, String dateOfBirth, String description, int numScriptions,
            int numArticles, int numComments, int numLikes) {
        this.userID = userID;
        this.userName = userName;
        this.lastName = lastName;
        this.firstName = firstName;
        this.avatarPath = avatarPath;
        this.dateOfBirth = dateOfBirth;
        this.description = description;
    }

    public String toString() {
        return "SingleUserData{" +
                "id=" + userID +
                ", username='" + userName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dateOfBirth='" + dateOfBirth + '\'' +
                ", description='" + description + '\'' +
                ", avatarPath='" + avatarPath + '\'' +
                '}';
    }

    public int getUserID() {
        return userID;
    }

    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        SingleUserData other = (SingleUserData) obj;
        return userID == other.userID &&
                Objects.equals(userName, other.userName) &&
                Objects.equals(firstName, other.firstName) &&
                Objects.equals(lastName, other.lastName) &&
                Objects.equals(dateOfBirth, other.dateOfBirth) &&
                Objects.equals(description, other.description) &&
                Objects.equals(avatarPath, other.avatarPath);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userID, userName, firstName, lastName, dateOfBirth, description, avatarPath);
    }
}
