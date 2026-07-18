package com.Ai_Interview_Platform.DSA.controller;

import com.Ai_Interview_Platform.DSA.dto.testcase.TestCaseRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.testcase.TestCaseResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.testcase.TestCaseUpdateDTO;
import com.Ai_Interview_Platform.DSA.service.TestCaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestCaseService testCaseService;

    @PostMapping("/admin/test-cases")
    public ResponseEntity<TestCaseResponseDTO> createTestCase(
            @Valid @RequestBody TestCaseRequestDTO request) {

        return new ResponseEntity<>(
                testCaseService.createTestCase(request),
                HttpStatus.CREATED
        );

    }

    @GetMapping("/questions/{questionId}/test-cases")
    public ResponseEntity<List<TestCaseResponseDTO>> getSampleTestCases(
            @PathVariable Long questionId) {

        return ResponseEntity.ok(
                testCaseService.getSampleTestCases(questionId)
        );

    }

    @GetMapping("/admin/questions/{questionId}/test-cases")
    public ResponseEntity<List<TestCaseResponseDTO>> getAllTestCases(
            @PathVariable Long questionId) {

        return ResponseEntity.ok(
                testCaseService.getAllTestCases(questionId)
        );

    }

    @PatchMapping("/admin/test-cases/{id}")
    public ResponseEntity<TestCaseResponseDTO> updateTestCase(
            @PathVariable Long id,
            @RequestBody TestCaseUpdateDTO request) {

        return ResponseEntity.ok(
                testCaseService.updateTestCase(id, request)
        );

    }

    @DeleteMapping("/admin/test-cases/{id}")
    public ResponseEntity<String> deleteTestCase(
            @PathVariable Long id) {

        testCaseService.deleteTestCase(id);

        return ResponseEntity.ok("Test case deleted successfully");

    }

}