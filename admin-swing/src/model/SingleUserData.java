package model;

public class SingleUserData {

    public final int userID;
	public final String userName;
    public final String firstName;
	public final String lastName;
    public final String dateOfBirth;
    public final String description;
    public final String avatarPath;


    // public final int numSubscriptions;
    // public final int numArticles;
    // public final int numComments;
    // public final int numLikes;

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
        // this.numSubscriptions = numScriptions;
        // this.numArticles = numArticles;
        // this.numComments = numComments;
        // this.numLikes = numLikes;
    }

    @Override
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


}
