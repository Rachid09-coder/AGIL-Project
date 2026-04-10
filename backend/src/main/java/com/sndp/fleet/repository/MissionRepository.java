package com.sndp.fleet.repository;

import com.sndp.fleet.model.Mission;
import com.sndp.fleet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MissionRepository extends JpaRepository<Mission, Long> {
    List<Mission> findByDriver(User driver);
}
