package gui;

import javax.swing.table.AbstractTableModel;

import model.AllUserData;
import model.SingleUserData;

/**
 * User Table Model for storing user info
 */
public class UserTableModel<Object> extends AbstractTableModel {
    
    private final AllUserData userInfo;
	private final String[] columnNames = {"UserID", "Username", "Firstname", "Lastname", "Dateofbirth", "Description", "Avatarpath"};

    public UserTableModel(AllUserData userInfo) {
		this.userInfo = userInfo;
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
			default -> null;
		};
	}

}
