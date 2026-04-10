package com.sndp.fleet.config;

import com.sndp.fleet.model.Role;
import com.sndp.fleet.model.User;
import com.sndp.fleet.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    CommandLineRunner initUsers() {
        return args -> {
            if (!userRepository.existsByUsername("manager")) {
                User manager = new User();
                manager.setUsername("manager");
                manager.setPassword(passwordEncoder.encode("manager123"));
                manager.setFullName("Chef du parc");
                manager.setEmail("manager@sndp.com");
                manager.setRole(Role.MANAGER);
                userRepository.save(manager);
            }

            if (!userRepository.existsByUsername("driver")) {
                User driver = new User();
                driver.setUsername("driver");
                driver.setPassword(passwordEncoder.encode("driver123"));
                driver.setFullName("Chauffeur SNDP");
                driver.setEmail("driver@sndp.com");
                driver.setRole(Role.DRIVER);
                userRepository.save(driver);
            }
        };
    }
}
