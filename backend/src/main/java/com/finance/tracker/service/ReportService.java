package com.finance.tracker.service;

import com.finance.tracker.model.User;
import java.time.LocalDate;

public interface ReportService {
    byte[] generatePdfReport(User user, LocalDate start, LocalDate end);
    byte[] generateCsvReport(User user, LocalDate start, LocalDate end);
}
