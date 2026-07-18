package com.Ai_Interview_Platform.DSA.mapper;

import com.Ai_Interview_Platform.DSA.dto.testcase.TestCaseRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.testcase.TestCaseResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.testcase.TestCaseUpdateDTO;
import com.Ai_Interview_Platform.DSA.entity.Question;
import com.Ai_Interview_Platform.DSA.entity.TestCase;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TestCaseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    TestCase toEntity(TestCaseRequestDTO dto);

    @Mapping(target = "questionId",
            expression = "java(mapQuestion(testCase.getQuestion()))")
    TestCaseResponseDTO toResponse(TestCase testCase);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateTestCaseFromDto(
            TestCaseUpdateDTO dto,
            @MappingTarget TestCase testCase);

    default Long mapQuestion(Question question) {

        return question == null ? null : question.getId();

    }

}