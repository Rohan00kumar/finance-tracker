package com.finance.tracker.controller;

import com.finance.tracker.dto.MessageResponse;
import com.finance.tracker.dto.ProfileRequest;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        return userRepository.findById(1L)
                .orElseGet(() -> userRepository.save(new User("Guest User", "guest@example.com", "Password123")));
    }

    @GetMapping
    public ResponseEntity<?> getProfile() {
        User user = getAuthenticatedUser();
        
        record UserProfile(String name, String email) {}
        return ResponseEntity.ok(new UserProfile(user.getName(), user.getEmail()));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileRequest profileRequest) {
        User user = getAuthenticatedUser();
        user.setName(profileRequest.getName());
        
        if (profileRequest.getPassword() != null && !profileRequest.getPassword().trim().isEmpty()) {
            if (profileRequest.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Password must be at least 6 characters."));
            }
            user.setPassword(profileRequest.getPassword()); // Plain text since security is disabled
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }
}
