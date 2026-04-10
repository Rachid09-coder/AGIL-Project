package com.sndp.fleet.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Declaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeclarationType type;

    @Column(nullable = false, length = 1500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime declarationDate;

    @ManyToOne(optional = false)
    private User driver;

    private String managerComment;

    public Declaration() {
    }

    public Declaration(Long id, DeclarationType type, String description, LocalDateTime declarationDate, User driver, String managerComment) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.declarationDate = declarationDate;
        this.driver = driver;
        this.managerComment = managerComment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getDeclarationDate() {
        return declarationDate;
    }

    public void setDeclarationDate(LocalDateTime declarationDate) {
        this.declarationDate = declarationDate;
    }

    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }

    public String getManagerComment() {
        return managerComment;
    }

    public void setManagerComment(String managerComment) {
        this.managerComment = managerComment;
    }
}
