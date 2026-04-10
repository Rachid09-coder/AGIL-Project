package com.sndp.fleet.controller;

import com.sndp.fleet.dto.DeclarationRequest;
import com.sndp.fleet.dto.MaintenanceRequestDto;
import com.sndp.fleet.model.*;
import com.sndp.fleet.repository.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    private final UserRepository userRepository;
    private final MissionRepository missionRepository;
    private final DeclarationRepository declarationRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final VehicleRepository vehicleRepository;

    public DriverController(UserRepository userRepository,
                            MissionRepository missionRepository,
                            DeclarationRepository declarationRepository,
                            MaintenanceRequestRepository maintenanceRequestRepository,
                            VehicleRepository vehicleRepository) {
        this.userRepository = userRepository;
        this.missionRepository = missionRepository;
        this.declarationRepository = declarationRepository;
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping("/missions")
    public List<Mission> getMyMissions(Principal principal) {
        User driver = userRepository.findByUsername(principal.getName()).orElseThrow();
        return missionRepository.findByDriver(driver);
    }

    @GetMapping("/vehicles")
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findAll();
    }

    @GetMapping("/declarations")
    public List<Declaration> getMyDeclarations(Principal principal) {
        User driver = userRepository.findByUsername(principal.getName()).orElseThrow();
        return declarationRepository.findByDriver(driver);
    }

    @PostMapping("/declarations")
    public Declaration createDeclaration(@RequestBody @Valid DeclarationRequest request, Principal principal) {
        User driver = userRepository.findByUsername(principal.getName()).orElseThrow();
        Declaration declaration = new Declaration();
        declaration.setType(request.getType());
        declaration.setDescription(request.getDescription());
        declaration.setDeclarationDate(LocalDateTime.now());
        declaration.setDriver(driver);
        return declarationRepository.save(declaration);
    }

    @GetMapping("/maintenance")
    public List<MaintenanceRequest> getMyMaintenance(Principal principal) {
        User driver = userRepository.findByUsername(principal.getName()).orElseThrow();
        return maintenanceRequestRepository.findByDriver(driver);
    }

    @PostMapping("/maintenance")
    public MaintenanceRequest createMaintenance(@RequestBody @Valid MaintenanceRequestDto request, Principal principal) {
        User driver = userRepository.findByUsername(principal.getName()).orElseThrow();
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow();

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setRequestType(request.getRequestType());
        maintenanceRequest.setDescription(request.getDescription());
        maintenanceRequest.setVehicle(vehicle);
        maintenanceRequest.setDriver(driver);
        maintenanceRequest.setStatus(RequestStatus.PENDING);
        maintenanceRequest.setCreatedAt(LocalDateTime.now());

        return maintenanceRequestRepository.save(maintenanceRequest);
    }
}
