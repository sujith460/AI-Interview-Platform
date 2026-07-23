package com.Ai_Interview_Platform.DSA.pattern.service;

import com.Ai_Interview_Platform.DSA.pattern.dto.PatternRequestDTO;
import com.Ai_Interview_Platform.DSA.pattern.dto.PatternResponseDTO;
import com.Ai_Interview_Platform.DSA.pattern.entity.Pattern;
import com.Ai_Interview_Platform.DSA.pattern.mapper.PatternMapper;
import com.Ai_Interview_Platform.DSA.pattern.repository.PatternRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatternService {

    private final PatternRepository patternRepository;
    private final PatternMapper patternMapper;

    public PatternResponseDTO createPattern(PatternRequestDTO request) {

        if (patternRepository.existsByName(request.getName())) {
            throw new RuntimeException("Pattern already exists");
        }

        Pattern pattern = patternMapper.toEntity(request);

        Pattern savedPattern = patternRepository.save(pattern);

        return patternMapper.toResponse(savedPattern);
    }

    public List<PatternResponseDTO> getAllPatterns() {

        return patternRepository.findAll()
                .stream()
                .map(patternMapper::toResponse)
                .toList();
    }

    public PatternResponseDTO getPatternById(Long id) {

        Pattern pattern = patternRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Pattern not found"));

        return patternMapper.toResponse(pattern);
    }

    public PatternResponseDTO updatePattern(Long id,
                                            PatternRequestDTO request) {

        Pattern pattern = patternRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Pattern not found"));

        if (request.getName() != null) {

            patternRepository.findByName(request.getName())
                    .ifPresent(existingPattern -> {

                        if (!existingPattern.getId().equals(id)) {
                            throw new RuntimeException("Pattern already exists");
                        }

                    });

        }

        patternMapper.updatePatternFromDto(request, pattern);

        Pattern updatedPattern = patternRepository.save(pattern);

        return patternMapper.toResponse(updatedPattern);
    }

    public void deletePattern(Long id) {

        Pattern pattern = patternRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Pattern not found"));

        patternRepository.delete(pattern);
    }

}
