package com.Ai_Interview_Platform.DSA.testcase.mapper;

import com.Ai_Interview_Platform.DSA.testcase.dto.TestCaseRequestDTO;
import com.Ai_Interview_Platform.DSA.testcase.dto.TestCaseResponseDTO;
import com.Ai_Interview_Platform.DSA.testcase.dto.TestCaseUpdateDTO;
import com.Ai_Interview_Platform.DSA.testcase.entity.TestCase;
import com.Ai_Interview_Platform.DSA.question.entity.Question;
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
