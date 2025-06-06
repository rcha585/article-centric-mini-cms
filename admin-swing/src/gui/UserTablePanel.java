package gui;

import javax.swing.table.AbstractTableModel;

import model.AllUserData;
import model.SingleUserData;
import model.UserListener;

public class UserTablePanel<Object> extends AbstractTableModel implements UserListener {
    
    private final AllUserData userInfo;
	private final String[] columnNames = {"UserID", "Username", "Firstname", "Lastname", "Dateofbirth", "Description", "Avatarpath"};

    // {"id":11,"username":"paige_phan","first_name":"Paige","last_name":"Phan","date_of_birth":"1990-05-30 12:34:56","description":"Hello, I am Paige.","avatar_path":"/images/john.png"}

    public UserTablePanel(AllUserData userInfo) {
		this.userInfo = userInfo;
		this.userInfo.addUserListener(this); // Register for updates
	}

    @Override
	public int getRowCount() {
		return userInfo.size();
	}

	@Override
	public int getColumnCount() {
		return columnNames.length;
	}

    @Override
	public String getColumnName(int column) {
		return columnNames[column];
	}


    // {"id":11,"username":"paige_phan","first_name":"Paige","last_name":"Phan","date_of_birth":"1990-05-30 12:34:56","description":"Hello, I am Paige.","avatar_path":"/images/john.png"}

    @Override
	public String getValueAt(int rowIndex, int columnIndex) {
		SingleUserData result = userInfo.getDataAt(rowIndex); // uses getResultAt()
		if (result == null) return null;

		return switch (columnIndex) {
			case 0 -> String.valueOf(result.userID);
			case 1 -> result.userName;
			case 2 -> result.firstName;
            case 3 -> result.lastName;
            case 4 -> result.dateOfBirth;
            case 5 -> result.description;
            case 6 -> result.avatarPath;
			// case 3 -> result.getAssessmentElement(StudentResult.AssessmentElement.Exam).toString();
			// case 4 -> result.getAssessmentElement(StudentResult.AssessmentElement.Test).toString();
			// case 5 -> result.getAssessmentElement(StudentResult.AssessmentElement.Assignment).toString();
			// case 6 -> result.getAssessmentElement(StudentResult.AssessmentElement.Overall).toString();
			default -> null;
		};
	}

    /**
	 * Called when the Course model changes.
	 * Notifies the JTable to refresh all data.
	 */
	@Override
	public void userHasChanged(AllUserData userInfo) {
		fireTableDataChanged(); // Notify JTable that data has been updated
	}

}
