package com.sndp.fleet.controller;

import com.sndp.fleet.dto.MissionRequest;
import com.sndp.fleet.dto.DeclarationReviewRequest;
import com.sndp.fleet.dto.DriverUpsertRequest;
import com.sndp.fleet.dto.ManagerProfileUpdateRequest;
import com.sndp.fleet.model.*;
import com.sndp.fleet.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final MissionRepository missionRepository;
    private final DeclarationRepository declarationRepository;
    private final PasswordEncoder passwordEncoder;

    public ManagerController(UserRepository userRepository,
                             VehicleRepository vehicleRepository,
                             MissionRepository missionRepository,
                             DeclarationRepository declarationRepository,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.missionRepository = missionRepository;
        this.declarationRepository = declarationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> profile(Principal principal) {
        User manager = userRepository.findByUsername(principal.getName()).orElseThrow();
        return ResponseEntity.ok(manager);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(Principal principal, @RequestBody @Valid ManagerProfileUpdateRequest request) {
        User manager = userRepository.findByUsername(principal.getName()).orElseThrow();
        manager.setFullName(request.getFullName());
        manager.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            manager.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return ResponseEntity.ok(userRepository.save(manager));
    }

    @GetMapping("/drivers")
    public List<User> getDrivers() {
        return userRepository.findByRole(Role.DRIVER);
    }

    @PostMapping("/drivers")
    public User createDriver(@RequestBody @Valid DriverUpsertRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Nom d'utilisateur déjà utilisé");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        User driver = new User();
        driver.setUsername(request.getUsername());
        driver.setPassword(passwordEncoder.encode(request.getPassword() == null || request.getPassword().isBlank() ? "driver123" : request.getPassword()));
        driver.setFullName(request.getFullName());
        driver.setEmail(request.getEmail());
        driver.setRole(Role.DRIVER);
        return userRepository.save(driver);
    }

    @PutMapping("/drivers/{id}")
    public User updateDriver(@PathVariable Long id, @RequestBody @Valid DriverUpsertRequest request) {
        User driver = userRepository.findById(id).orElseThrow();
        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException("Utilisateur non chauffeur");
        }

        if (!driver.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Nom d'utilisateur déjà utilisé");
        }

        if (!driver.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        driver.setUsername(request.getUsername());
        driver.setFullName(request.getFullName());
        driver.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            driver.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return userRepository.save(driver);
    }

    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        User driver = userRepository.findById(id).orElseThrow();
        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException("Utilisateur non chauffeur");
        }
        userRepository.delete(driver);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/vehicles")
    public List<Vehicle> getVehicles() {
        return vehicleRepository.findAll();
    }

    @PostMapping("/vehicles")
    public Vehicle createVehicle(@RequestBody @Valid Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @PutMapping("/vehicles/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody @Valid Vehicle payload) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow();
        vehicle.setPlateNumber(payload.getPlateNumber());
        vehicle.setBrand(payload.getBrand());
        vehicle.setModel(payload.getModel());
        vehicle.setStatus(payload.getStatus());
        return vehicleRepository.save(vehicle);
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/missions")
    public List<Mission> getMissions() {
        return missionRepository.findAll();
    }

    @PostMapping("/missions")
    public Mission createMission(@RequestBody @Valid MissionRequest request) {
        User driver = userRepository.findById(request.getDriverId()).orElseThrow();
        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException("Le conducteur doit être un chauffeur");
        }
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow();

        Mission mission = new Mission();
        mission.setTitle(request.getTitle());
        mission.setDescription(request.getDescription());
        mission.setDestination(request.getDestination());
        mission.setStartDate(request.getStartDate());
        mission.setEndDate(request.getEndDate());
        mission.setStatus(request.getStatus());
        mission.setDriver(driver);
        mission.setVehicle(vehicle);

        return missionRepository.save(mission);
    }

    @PutMapping("/missions/{id}")
    public Mission updateMission(@PathVariable Long id, @RequestBody @Valid MissionRequest request) {
        Mission mission = missionRepository.findById(id).orElseThrow();
        User driver = userRepository.findById(request.getDriverId()).orElseThrow();
        if (driver.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException("Le conducteur doit être un chauffeur");
        }
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow();

        mission.setTitle(request.getTitle());
        mission.setDescription(request.getDescription());
        mission.setDestination(request.getDestination());
        mission.setStartDate(request.getStartDate());
        mission.setEndDate(request.getEndDate());
        mission.setStatus(request.getStatus());
        mission.setDriver(driver);
        mission.setVehicle(vehicle);
        return missionRepository.save(mission);
    }

    @DeleteMapping("/missions/{id}")
    public ResponseEntity<Void> deleteMission(@PathVariable Long id) {
        missionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/declarations")
    public List<Declaration> getDeclarations() {
        return declarationRepository.findAll();
    }

    @PutMapping("/declarations/{id}/review")
    public Declaration reviewDeclaration(@PathVariable Long id, @RequestBody @Valid DeclarationReviewRequest request) {
        Declaration declaration = declarationRepository.findById(id).orElseThrow();
        declaration.setManagerComment(request.getManagerComment());
        return declarationRepository.save(declaration);
    }

    @DeleteMapping("/declarations/{id}")
    public ResponseEntity<Void> deleteDeclaration(@PathVariable Long id) {
        declarationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
