package gui;

import java.util.ArrayList;
import java.util.List;

import model.SingleUserData;

public class JsonManualParser {

    public static List<SingleUserData> parseUsers(String json) {
        List<SingleUserData> userList = new ArrayList<>();

        // Remove the outer brackets []
        json = json.trim();
        if (json.startsWith("[")) json = json.substring(1);
        if (json.endsWith("]")) json = json.substring(0, json.length() - 1);

        // Split user objects by "},{"
        String[] usersJson = json.split("\\},\\{");

        for (String userStr : usersJson) {
            // Clean up braces
            if (!userStr.startsWith("{")) userStr = "{" + userStr;
            if (!userStr.endsWith("}")) userStr = userStr + "}";

            // Extract fields
            int id = extractInt(userStr, "\"id\":");
            String username = extractString(userStr, "\"username\":\"");
            String firstName = extractString(userStr, "\"first_name\":\"");
            String lastName = extractString(userStr, "\"last_name\":\"");
            String dateOfBirth = extractString(userStr, "\"date_of_birth\":\"");
            String description = extractString(userStr, "\"description\":\"");
            String avatarPath = extractString(userStr, "\"avatar_path\":\"");

            SingleUserData user = new SingleUserData(
                id, username, lastName, firstName, avatarPath, dateOfBirth, description,
                0, 0, 0, 0 // dummy values
            );

            userList.add(user);
        }

        return userList;
    }

    private static int extractInt(String src, String key) {
        int idx = src.indexOf(key);
        if (idx == -1) return 0;
        int end = src.indexOf(",", idx);
        if (end == -1) end = src.indexOf("}", idx);
        return Integer.parseInt(src.substring(idx + key.length(), end).trim());
    }

    private static String extractString(String src, String key) {
        int idx = src.indexOf(key);
        if (idx == -1) return "";
        int start = idx + key.length();
        int end = src.indexOf("\"", start);
        return src.substring(start, end);
    }
}
