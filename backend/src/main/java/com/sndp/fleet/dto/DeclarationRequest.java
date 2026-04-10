package com.sndp.fleet.dto;

import com.sndp.fleet.model.DeclarationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DeclarationRequest {
    @NotNull
    private DeclarationType type;

    @NotBlank
    private String description;

    public DeclarationType getType() {
        return type;
    }

    public void setType(DeclarationType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
