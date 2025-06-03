package controller;

import java.util.List;
import model.SingleUserData;

public interface ButtonListener {
    public void isLoginSuccess(List<SingleUserData> data);
    public void clickLogout(); 
}
