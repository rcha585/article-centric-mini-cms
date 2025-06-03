package model;

import java.util.*;

public class AllUserData {
    /*
	 * StudentResult objects are stored in a Hashtable where the key is the
	 * unique student ID and the value is the associated StudentResult object.
	 */
	private Hashtable<Integer, SingleUserData> userData;

    /*
	 * An indexed collection of the StudentResult objects stored in the results
	 * hashtable. This essentially provides an index offering direct access to
	 * any StudentResult object stored.
	 */
	private List<SingleUserData> indexedData;

    /*
	 * List of registered CourseListener objects.
	 */
	private List<UserListener> listeners;

    /*
	 * Creates an empty Course instance.
	 */
	public AllUserData() {
		userData = new Hashtable<Integer, SingleUserData>();
		indexedData = new ArrayList<SingleUserData>();
		listeners = new ArrayList<UserListener>();
	}

    /**
	 * Adds a new StudentResult object to the model.
	 * 
	 * @param result
	 *            the new StudentResult object.
	 */
	public void addUserData(SingleUserData userInfo) {
		userData.put(userInfo.userID, userInfo);
		// Regenerate index.
		indexedData = new ArrayList<SingleUserData>(userData.values());
	}

    /**
	 * Returns a particular StudentResult object from the model.
	 * 
	 * @param studentID
	 *            the unique ID of the student.
	 * @return the StudentResult object corresponding to the studentID argument,
	 *         null if there is no such StudentResult object.
	 */
	public SingleUserData getData(int userID) {
		Integer key = userID;
		return userData.get(key);
	}

    /**
	 * Returns the StudentResult object at a specified index position within the
	 * model.
	 * 
	 * @param index
	 *            the index position.
	 * @return the corresponding StudentResult object or null if there is no
	 *         matching StudentResult object in the model.
	 */
	public SingleUserData getDataAt(int index) {
		if (index < 0 || index >= userData.size()) {
			return null;
		} else {
			return indexedData.get(index);
		}
	}

    /**
	 * Returns the index of a particular StudentResult object.
	 * 
	 * @param result
	 *            the StudentResult object whose index position is sought.
	 * @return the index position.
	 */
	public int indexOf(SingleUserData userInfo) {
		return indexedData.indexOf(userInfo);
	}

    /**
	 * Returns an Iterator object which can be used to iterate through the
	 * Course model's StudentResult objects.
	 * 
	 * @return an Iterator of StudentResult objects.
	 */
	public Iterator<SingleUserData> iterator() {
		return indexedData.iterator();
	}

    /**
	 * Returns the number of StudentResult objects stored in the model.
	 */
	public int size() {
		return userData.size();
	}

    /**
	 * Registers a CourseListener object with this Course object. Once 
	 * registered, the listener will receive update notifications when the
	 * Course changes its state.
	 * 
	 * @param listener
	 * 				the CourseListener to register.
	 */
	public void addUserListener(UserListener listener) {
		listeners.add(listener);
	}

    /**
	 * Deregisters a CourseListener object from this Course object. Once
	 * deregistered, the listener will no longer receive updates.
	 * 
	 * @param listener
	 * 				the CourseListener to deregister.
	 */
	public void removeUserListener(UserListener listener) {
		listeners.remove(listener);
	}

	/**
	 * Clears all user data from the model.
	 */
	public void clear() {
		userData.clear();
		indexedData.clear();

		for (UserListener listener : listeners) {
			listener.userHasChanged(this); // Notify observers
		}
}
}
