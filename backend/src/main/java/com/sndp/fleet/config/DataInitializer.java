package com.sndp.fleet.config;

import com.sndp.fleet.model.*;
import com.sndp.fleet.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VehicleRepository vehicleRepository;
    private final MissionRepository missionRepository;
    private final DeclarationRepository declarationRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                          VehicleRepository vehicleRepository, MissionRepository missionRepository,
                          DeclarationRepository declarationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.vehicleRepository = vehicleRepository;
        this.missionRepository = missionRepository;
        this.declarationRepository = declarationRepository;
    }

    @Bean
    CommandLineRunner initUsers() {
        return args -> {
            User manager = null;
            if (!userRepository.existsByUsername("manager")) {
                manager = new User();
                manager.setUsername("manager");
                manager.setPassword(passwordEncoder.encode("manager123"));
                manager.setFullName("Chef du parc");
                manager.setEmail("manager@sndp.com");
                manager.setRole(Role.MANAGER);
                manager = userRepository.save(manager);
            } else {
                manager = userRepository.findByUsername("manager").orElse(null);
            }

            User driver = null;
            if (!userRepository.existsByUsername("driver")) {
                driver = new User();
                driver.setUsername("driver");
                driver.setPassword(passwordEncoder.encode("driver123"));
                driver.setFullName("Chauffeur SNDP");
                driver.setEmail("driver@sndp.com");
                driver.setRole(Role.DRIVER);
                driver = userRepository.save(driver);
            } else {
                driver = userRepository.findByUsername("driver").orElse(null);
            }
            // Add 3 test drivers
            User driver1 = null;
            if (!userRepository.existsByUsername("rachid")) {
                driver1 = new User();
                driver1.setUsername("rachid");
                driver1.setPassword(passwordEncoder.encode("driver123"));
                driver1.setFullName("Rachid Gharbi");
                driver1.setEmail("rachid.gharbi@sndp.com");
                driver1.setRole(Role.DRIVER);
                driver1 = userRepository.save(driver1);
            } else {
                driver1 = userRepository.findByUsername("rachid").orElse(null);
            }

            User driver2 = null;
            if (!userRepository.existsByUsername("amir")) {
                driver2 = new User();
                driver2.setUsername("amir");
                driver2.setPassword(passwordEncoder.encode("driver123"));
                driver2.setFullName("Amir Berjab");
                driver2.setEmail("amir.berjab@sndp.com");
                driver2.setRole(Role.DRIVER);
                driver2 = userRepository.save(driver2);
            } else {
                driver2 = userRepository.findByUsername("amir").orElse(null);
            }

            User driver3 = null;
            if (!userRepository.existsByUsername("ghassen")) {
                driver3 = new User();
                driver3.setUsername("ghassen");
                driver3.setPassword(passwordEncoder.encode("driver123"));
                driver3.setFullName("Ghassen Ouahabi");
                driver3.setEmail("ghassen.ouahabi@sndp.com");
                driver3.setRole(Role.DRIVER);
                driver3 = userRepository.save(driver3);
            } else {
                driver3 = userRepository.findByUsername("ghassen").orElse(null);
            }
            // Add test vehicles
            if (vehicleRepository.count() == 0) {
                Vehicle v1 = new Vehicle();
                v1.setPlateNumber("TN-123-ABC");
                v1.setBrand("Peugeot");
                v1.setModel("Partner");
                v1.setStatus("AVAILABLE");
                vehicleRepository.save(v1);

                Vehicle v2 = new Vehicle();
                v2.setPlateNumber("TN-456-DEF");
                v2.setBrand("Mercedes");
                v2.setModel("Sprinter");
                v2.setStatus("IN_USE");
                vehicleRepository.save(v2);

                Vehicle v3 = new Vehicle();
                v3.setPlateNumber("TN-789-GHI");
                v3.setBrand("Renault");
                v3.setModel("Master");
                v3.setStatus("MAINTENANCE");
                vehicleRepository.save(v3);
            }

            // Add test missions
            if (missionRepository.count() == 0) {
                java.util.List<Vehicle> allVehicles = vehicleRepository.findAll();
                java.util.List<User> allDrivers = java.util.Arrays.asList(driver, driver1, driver2, driver3);
                
                if (!allVehicles.isEmpty()) {
                    // Mission 1 for driver (Rachid)
                    Mission m1 = new Mission();
                    m1.setTitle("Livraison Tunis");
                    m1.setDescription("Transport de trois palettes de produits");
                    m1.setDestination("Tunis Centre");
                    m1.setStartDate(java.time.LocalDate.now().plusDays(1));
                    m1.setEndDate(java.time.LocalDate.now().plusDays(1));
                    m1.setStatus("PLANNED");
                    m1.setDriver(driver1 != null ? driver1 : driver);
                    m1.setVehicle(allVehicles.get(0));
                    missionRepository.save(m1);

                    // Mission 2 for driver1 (Amir)
                    Mission m2 = new Mission();
                    m2.setTitle("Transport marchandises");
                    m2.setDescription("Produits chimiques transport sécurisé");
                    m2.setDestination("Sfax");
                    m2.setStartDate(java.time.LocalDate.now());
                    m2.setEndDate(java.time.LocalDate.now().plusDays(1));
                    m2.setStatus("IN_PROGRESS");
                    m2.setDriver(driver2 != null ? driver2 : driver);
                    m2.setVehicle(allVehicles.size() > 1 ? allVehicles.get(1) : allVehicles.get(0));
                    missionRepository.save(m2);

                    // Mission 3 for driver2 (Ghassen)
                    Mission m3 = new Mission();
                    m3.setTitle("Collecte marchandises");
                    m3.setDescription("Collecte de colis à Sousse");
                    m3.setDestination("Sousse Port");
                    m3.setStartDate(java.time.LocalDate.now().plusDays(2));
                    m3.setEndDate(java.time.LocalDate.now().plusDays(2).plusDays(1));
                    m3.setStatus("PLANNED");
                    m3.setDriver(driver3 != null ? driver3 : driver);
                    m3.setVehicle(allVehicles.size() > 2 ? allVehicles.get(2) : allVehicles.get(0));
                    missionRepository.save(m3);

                    // Mission 4 completed for original driver
                    Mission m4 = new Mission();
                    m4.setTitle("Distribution produits");
                    m4.setDescription("Distribution de produits SNDP");
                    m4.setDestination("Monastir");
                    m4.setStartDate(java.time.LocalDate.now().minusDays(2));
                    m4.setEndDate(java.time.LocalDate.now().minusDays(1));
                    m4.setStatus("COMPLETED");
                    m4.setDriver(driver);
                    m4.setVehicle(allVehicles.get(0));
                    missionRepository.save(m4);
                }
            }

            // Add test declarations
            if (declarationRepository.count() == 0) {
                java.util.List<User> testDrivers = java.util.Arrays.asList(driver, driver1, driver2, driver3);
                
                Declaration d1 = new Declaration();
                d1.setType(DeclarationType.FINE);
                d1.setDescription("Amende stationnement interdit à Tunis Centre - 50 DT");
                d1.setDeclarationDate(LocalDateTime.now().minusDays(2));
                d1.setDriver(driver1 != null ? driver1 : driver);
                d1.setManagerComment("Amende à contester auprès de la mairie de Tunis");
                declarationRepository.save(d1);

                Declaration d2 = new Declaration();
                d2.setType(DeclarationType.ACCIDENT);
                d2.setDescription("Accident léger à Sfax - collision arrière - autre conducteur responsable");
                d2.setDeclarationDate(LocalDateTime.now().minusDays(1));
                d2.setDriver(driver2 != null ? driver2 : driver);
                d2.setManagerComment("Dossier d'assurance en cours - rapport d'accident établi");
                declarationRepository.save(d2);

                Declaration d3 = new Declaration();
                d3.setType(DeclarationType.FINE);
                d3.setDescription("Dépassement de vitesse à Sousse - 75 km/h dans zone 50");
                d3.setDeclarationDate(LocalDateTime.now().minusDays(3));
                d3.setDriver(driver3 != null ? driver3 : driver);
                d3.setManagerComment("En attente du PV officiel de la police");
                declarationRepository.save(d3);
            }
        };
    }
}
