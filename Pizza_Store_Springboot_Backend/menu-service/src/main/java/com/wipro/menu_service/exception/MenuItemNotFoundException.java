package com.wipro.menu_service.exception;

public class MenuItemNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MenuItemNotFoundException(String message) {
        super(message);
    }
}
