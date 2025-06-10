import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createChapterNote,
  updateChapterNote,
  deleteChapterNote,
} from "../api/notes.api";

export const useNotes = () => {
  const queryClient = useQueryClient();

  const useCreateChapterNote = useMutation({
    mutationFn: createChapterNote,
    onSuccess: (_, variables) => {
      // Invalida las consultas específicas de notas si las tienes
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.chapterId],
      });

      // Importante: Invalida también la consulta de inscripción que contiene los datos del curso
      queryClient.invalidateQueries({
        queryKey: ["enrollment", "course", variables.courseId],
      });

      // También invalidar la consulta de enrollments si es necesario
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "my"],
      });
    },
  });

  const useUpdateChapterNote = useMutation({
    mutationFn: updateChapterNote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.chapterId],
      });

      // Invalida la consulta de enrollment que contiene los datos del curso
      queryClient.invalidateQueries({
        queryKey: ["enrollment", "course", variables.courseId],
      });

      // También invalidar la consulta de enrollments si es necesario
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "my"],
      });
    },
  });

  const useDeleteChapterNote = useMutation({
    mutationFn: deleteChapterNote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.chapterId],
      });

      // Invalida la consulta de enrollment que contiene los datos del curso
      queryClient.invalidateQueries({
        queryKey: ["enrollment", "course", variables.courseId],
      });

      // También invalidar la consulta de enrollments si es necesario
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "my"],
      });
    },
  });

  return {
    useCreateChapterNote,
    useUpdateChapterNote,
    useDeleteChapterNote,
  };
};
