package com.sndp.fleet.repository;

import com.sndp.fleet.model.Declaration;
import com.sndp.fleet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeclarationRepository extends JpaRepository<Declaration, Long> {
    List<Declaration> findByDriver(User driver);
}
