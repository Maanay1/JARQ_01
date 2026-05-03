import { apiRequest } from "@/lib/services/api-client";
import { checkDemoAnswer, demoCourses, getDemoCourseLessons, getDemoLesson } from "@/lib/demo-lessons";
import { CheckAnswerResponse, Course, Lesson } from "@/lib/types";

export async function getCourses(): Promise<Course[]> {
  try {
    const courses = await apiRequest<Course[]>("/courses", { cache: "no-store" });
    return courses.length ? courses : demoCourses;
  } catch {
    return demoCourses;
  }
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  try {
    const lessons = await apiRequest<Lesson[]>(`/courses/${courseId}/lessons`, { cache: "no-store" });
    return lessons.length ? lessons : getDemoCourseLessons(courseId);
  } catch {
    return getDemoCourseLessons(courseId);
  }
}

export async function getLesson(lessonId: string): Promise<Lesson> {
  try {
    return await apiRequest<Lesson>(`/lessons/${lessonId}`, { cache: "no-store" });
  } catch {
    return getDemoLesson(lessonId);
  }
}

export async function checkLessonAnswer(params: {
  lessonId: string;
  userId: string;
  taskId: string;
  answer: string;
}): Promise<CheckAnswerResponse> {
  try {
    return await apiRequest<CheckAnswerResponse>(`/lessons/${params.lessonId}/check-answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: params.userId,
        task_id: params.taskId,
        answer: params.answer,
      }),
    });
  } catch {
    return checkDemoAnswer(params);
  }
}
