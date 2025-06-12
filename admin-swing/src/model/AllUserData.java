package model;

import java.util.*;

/**
 * All User Data
 */
public class AllUserData {
    /*
	 * 
	 * User objects are stored in a Hashtable where the key is the
	 * unique user ID and the value is the associated User object.
	 */
	private Hashtable<Integer, SingleUserData> userData;

    /*
	 * An indexed collection of the User Info objects stored in the results
	 * hashtable. This essentially provides an index offering direct access to
	 * any User Info object stored.
	 */
	private List<SingleUserData> indexedData;

    /*
	 * Creates an empty Course instance.
	 */
	public AllUserData() {
		userData = new Hashtable<Integer, SingleUserData>();
		indexedData = new ArrayList<SingleUserData>();
	}

    /**
	 * Adds a new user object to the model.
	 * 
	 * @param result
	 *            the new user object.
	 */
	public void addUserData(SingleUserData userInfo) {
		userData.put(userInfo.userID, userInfo);
		// Regenerate index.
		indexedData = new ArrayList<SingleUserData>(userData.values());
	}

    /**
	 * Returns a particular user object from the the unique ID of the user.
	 */
	public SingleUserData getData(int userID) {
		Integer key = userID;
		return userData.get(key);
	}

    /**
	 * Returns the user object at a specified index position within the
	 * model.
	 * 
	 * @param index
	 *            the index position.
	 * @return the corresponding user object or null if there is no
	 *         matching user object in the model.
	 */
	public SingleUserData getDataAt(int index) {
		if (index < 0 || index >= userData.size()) {
			return null;
		} else {
			return indexedData.get(index);
		}
	}

    /**
	 * Returns the number of user objects stored in the model.
	 */
	public int size() {
		return userData.size();
	}

	/**
	 * Clears all user data from the model.
	 */
	public void clear() {
		userData.clear();
		indexedData.clear();
	}

	public void removeUserByID(int userID) {
		userData.remove(userID);
		indexedData = new ArrayList<>(userData.values()); // Rebuild index
	}
}
