package com.waw.waw.jwt;

import com.waw.waw.entity.User;
import com.waw.waw.repository.UserRepository;
import com.waw.waw.util.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import lombok.AllArgsConstructor;
import lombok.Data;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByMail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String hashedPassword = HashUtil.md5(request.getPassword());
        if (!hashedPassword.equals(user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByMail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setMail(request.getEmail());
        user.setPassword(HashUtil.md5(request.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}

@Data
class AuthRequest {
    private String email;
    private String password;
}

@Data
@AllArgsConstructor
class AuthResponse {
    private String token;
}
