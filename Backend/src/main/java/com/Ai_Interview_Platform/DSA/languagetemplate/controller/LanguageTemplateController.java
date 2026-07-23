package com.Ai_Interview_Platform.DSA.languagetemplate.controller;

import com.Ai_Interview_Platform.DSA.languagetemplate.dto.LanguageTemplateRequestDTO;
import com.Ai_Interview_Platform.DSA.languagetemplate.dto.LanguageTemplateResponseDTO;
import com.Ai_Interview_Platform.DSA.languagetemplate.dto.LanguageTemplateUpdateDTO;
import com.Ai_Interview_Platform.DSA.languagetemplate.service.LanguageTemplateService;
import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LanguageTemplateController {

    private final LanguageTemplateService languageTemplateService;

    @PostMapping("/admin/language-templates")
    public ResponseEntity<LanguageTemplateResponseDTO> createLanguageTemplate(
            @Valid @RequestBody LanguageTemplateRequestDTO request) {

        return new ResponseEntity<>(
                languageTemplateService.createLanguageTemplate(request),
                HttpStatus.CREATED
        );

    }

    @GetMapping("/questions/{questionId}/language-templates")
    public ResponseEntity<List<LanguageTemplateResponseDTO>> getAllLanguageTemplates(
            @PathVariable Long questionId) {

        return ResponseEntity.ok(
                languageTemplateService.getAllLanguageTemplates(questionId)
        );

    }

    @GetMapping("/questions/{questionId}/language-templates/{language}")
    public ResponseEntity<LanguageTemplateResponseDTO> getLanguageTemplate(
            @PathVariable Long questionId,
            @PathVariable ProgrammingLanguage language) {

        return ResponseEntity.ok(
                languageTemplateService.getLanguageTemplate(
                        questionId,
                        language
                )
        );

    }

    @PatchMapping("/admin/language-templates/{id}")
    public ResponseEntity<LanguageTemplateResponseDTO> updateLanguageTemplate(
            @PathVariable Long id,
            @RequestBody LanguageTemplateUpdateDTO request) {

        return ResponseEntity.ok(
                languageTemplateService.updateLanguageTemplate(
                        id,
                        request
                )
        );

    }

    @DeleteMapping("/admin/language-templates/{id}")
    public ResponseEntity<String> deleteLanguageTemplate(
            @PathVariable Long id) {

        languageTemplateService.deleteLanguageTemplate(id);

        return ResponseEntity.ok(
                "Language Template deleted successfully"
        );

    }

}
