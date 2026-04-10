package com.sndp.fleet.repository;

import com.sndp.fleet.model.MaintenanceRequest;
import com.sndp.fleet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByDriver(User driver);
}
