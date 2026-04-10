package com.sndp.fleet.dto;

import com.sndp.fleet.model.Role;

public class AuthResponse {
    private String token;
    private String username;
    private Role role;
    private String fullName;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, Role role, String fullName) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
