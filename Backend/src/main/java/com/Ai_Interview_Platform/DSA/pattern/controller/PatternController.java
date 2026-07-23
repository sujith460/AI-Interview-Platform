package com.Ai_Interview_Platform.DSA.pattern.controller;

import com.Ai_Interview_Platform.DSA.pattern.dto.PatternRequestDTO;
import com.Ai_Interview_Platform.DSA.pattern.dto.PatternResponseDTO;
import com.Ai_Interview_Platform.DSA.pattern.service.PatternService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PatternController {

    private final PatternService patternService;

    @PostMapping("/admin/patterns")
    public ResponseEntity<PatternResponseDTO> createPattern(
            @Valid @RequestBody PatternRequestDTO request) {

        PatternResponseDTO response =
                patternService.createPattern(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/patterns")
    public ResponseEntity<List<PatternResponseDTO>> getAllPatterns() {

        return ResponseEntity.ok(
                patternService.getAllPatterns()
        );
    }

    @GetMapping("/patterns/{id}")
    public ResponseEntity<PatternResponseDTO> getPatternById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                patternService.getPatternById(id)
        );
    }

    @PatchMapping("/admin/patterns/{id}")
    public ResponseEntity<PatternResponseDTO> updatePattern(
            @PathVariable Long id,
            @RequestBody @Valid PatternRequestDTO request) {

        return ResponseEntity.ok(
                patternService.updatePattern(id, request)
        );
    }

    @DeleteMapping("/admin/patterns/{id}")
    public ResponseEntity<String> deletePattern(
            @PathVariable Long id) {

        patternService.deletePattern(id);

        return ResponseEntity.ok("Pattern deleted successfully");
    }

}
