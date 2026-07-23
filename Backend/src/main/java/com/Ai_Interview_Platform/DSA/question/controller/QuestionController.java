package com.Ai_Interview_Platform.DSA.question.controller;

import com.Ai_Interview_Platform.DSA.common.dto.PagedResponse;
import com.Ai_Interview_Platform.DSA.question.dto.*;
import com.Ai_Interview_Platform.DSA.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/admin/questions")
    public ResponseEntity<QuestionResponseDTO> createQuestion(
            @Valid @RequestBody QuestionRequestDTO request) {

        return new ResponseEntity<>(
                questionService.createQuestion(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionResponseDTO>> getAllQuestions() {

        return ResponseEntity.ok(
                questionService.getAllQuestions()
        );
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<QuestionResponseDTO> getQuestionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                questionService.getQuestionById(id)
        );
    }

    @GetMapping("/questions/slug/{slug}/details")
    public ResponseEntity<QuestionDetailsResponseDTO> getQuestionDetails(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                questionService.getQuestionDetails(slug)
        );
    }

    @PostMapping("/questions/search")
    public ResponseEntity<PagedResponse<QuestionResponseDTO>> searchQuestions(
            @Valid @RequestBody QuestionSearchRequestDTO request
    ) {

        return ResponseEntity.ok(
                questionService.searchQuestions(request)
        );

    }


    @PatchMapping("/admin/questions/{id}")
    public ResponseEntity<QuestionResponseDTO> updateQuestion(

            @PathVariable Long id,

            @Valid @RequestBody QuestionUpdateDTO request) {

        return ResponseEntity.ok(
                questionService.updateQuestion(id, request)
        );

    }

    @DeleteMapping("/admin/questions/{id}")
    public ResponseEntity<String> deleteQuestion(
            @PathVariable Long id) {

        questionService.deleteQuestion(id);

        return ResponseEntity.ok("Question deleted successfully");

    }

}
