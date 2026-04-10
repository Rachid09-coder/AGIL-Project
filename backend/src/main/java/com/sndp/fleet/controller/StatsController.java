package com.sndp.fleet.controller;

import com.sndp.fleet.model.RequestStatus;
import com.sndp.fleet.repository.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final MissionRepository missionRepository;
    private final DeclarationRepository declarationRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public StatsController(UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           MissionRepository missionRepository,
                           DeclarationRepository declarationRepository,
                           MaintenanceRequestRepository maintenanceRequestRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.missionRepository = missionRepository;
        this.declarationRepository = declarationRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
    }

    @GetMapping
    public Map<String, Long> getStats() {
        long pendingMaintenance = maintenanceRequestRepository.findAll().stream()
                .filter(m -> m.getStatus() == RequestStatus.PENDING)
                .count();

        return Map.of(
                "drivers", userRepository.findByRole(com.sndp.fleet.model.Role.DRIVER).stream().count(),
                "vehicles", vehicleRepository.count(),
                "missions", missionRepository.count(),
                "declarations", declarationRepository.count(),
                "pendingMaintenance", pendingMaintenance
        );
    }
}
