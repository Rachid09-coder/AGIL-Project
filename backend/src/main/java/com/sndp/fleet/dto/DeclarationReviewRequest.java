package com.sndp.fleet.dto;

import jakarta.validation.constraints.NotBlank;

public class DeclarationReviewRequest {
    @NotBlank
    private String managerComment;

    public String getManagerComment() {
        return managerComment;
    }

    public void setManagerComment(String managerComment) {
        this.managerComment = managerComment;
    }
}
