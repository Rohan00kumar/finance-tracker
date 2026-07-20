package com.finance.tracker.service;

import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.TransactionType;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.TransactionRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final TransactionRepository transactionRepository;

    public ReportServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public byte[] generatePdfReport(User user, LocalDate start, LocalDate end) {
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if (t.getType() == TransactionType.INCOME) {
                totalIncome = totalIncome.add(t.getAmount());
            } else {
                totalExpense = totalExpense.add(t.getAmount());
            }
        }
        BigDecimal netSavings = totalIncome.subtract(totalExpense);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(30, 41, 59));
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(100, 116, 139));
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(15, 23, 42));
            Font boldText = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(30, 41, 59));
            Font normalText = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(51, 65, 85));
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);

            // Document Header
            Paragraph title = new Paragraph("PERSONAL FINANCE REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(4);
            document.add(title);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            Paragraph subtitle = new Paragraph("Period: " + start.format(formatter) + " - " + end.format(formatter) + 
                    " | Generated for: " + user.getUsername(), subTitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Financial Summary Section (Cards)
            PdfPTable summaryTable = new PdfPTable(3);
            summaryTable.setWidthPercentage(100);
            summaryTable.setSpacingAfter(20);

            // Total Income Card
            PdfPCell cell1 = new PdfPCell(new Paragraph("Total Income\n\n$" + totalIncome, boldText));
            cell1.setBackgroundColor(new Color(240, 253, 244)); // Light green
            cell1.setBorderColor(new Color(187, 247, 208));
            cell1.setPadding(10);
            cell1.setHorizontalAlignment(Element.ALIGN_CENTER);
            summaryTable.addCell(cell1);

            // Total Expense Card
            PdfPCell cell2 = new PdfPCell(new Paragraph("Total Expenses\n\n$" + totalExpense, boldText));
            cell2.setBackgroundColor(new Color(254, 242, 242)); // Light red
            cell2.setBorderColor(new Color(254, 226, 226));
            cell2.setPadding(10);
            cell2.setHorizontalAlignment(Element.ALIGN_CENTER);
            summaryTable.addCell(cell2);

            // Net Savings Card
            PdfPCell cell3 = new PdfPCell(new Paragraph("Net Savings\n\n$" + netSavings, boldText));
            cell3.setBackgroundColor(new Color(239, 246, 255)); // Light blue
            cell3.setBorderColor(new Color(219, 234, 254));
            cell3.setPadding(10);
            cell3.setHorizontalAlignment(Element.ALIGN_CENTER);
            summaryTable.addCell(cell3);

            document.add(summaryTable);

            // Transaction Table Section Header
            Paragraph tableTitle = new Paragraph("Transaction Log", sectionFont);
            tableTitle.setSpacingAfter(10);
            document.add(tableTitle);

            // Transaction Table
            PdfPTable table = new PdfPTable(new float[]{15f, 20f, 35f, 15f, 15f});
            table.setWidthPercentage(100);
            table.setSpacingAfter(20);

            // Table Headers
            String[] headers = {"Date", "Category", "Description", "Type", "Amount"};
            for (String h : headers) {
                PdfPCell headerCell = new PdfPCell(new Paragraph(h, tableHeaderFont));
                headerCell.setBackgroundColor(new Color(71, 85, 105)); // Slate background
                headerCell.setPadding(6);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(headerCell);
            }

            // Table Rows
            for (Transaction t : transactions) {
                PdfPCell cDate = new PdfPCell(new Paragraph(t.getDate().format(formatter), normalText));
                cDate.setPadding(5);
                cDate.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cDate);

                PdfPCell cCategory = new PdfPCell(new Paragraph(t.getCategory(), normalText));
                cCategory.setPadding(5);
                table.addCell(cCategory);

                PdfPCell cDesc = new PdfPCell(new Paragraph(t.getDescription(), normalText));
                cDesc.setPadding(5);
                table.addCell(cDesc);

                String typeStr = t.getType().name();
                PdfPCell cType = new PdfPCell(new Paragraph(typeStr, normalText));
                cType.setPadding(5);
                cType.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cType);

                Color amtColor = t.getType() == TransactionType.INCOME ? new Color(22, 163, 74) : new Color(220, 38, 38);
                Font amtFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, amtColor);
                String amtPrefix = t.getType() == TransactionType.INCOME ? "+" : "-";
                PdfPCell cAmount = new PdfPCell(new Paragraph(amtPrefix + "$" + t.getAmount(), amtFont));
                cAmount.setPadding(5);
                cAmount.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cAmount);
            }

            if (transactions.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(new Paragraph("No transactions found in this period", normalText));
                emptyCell.setColspan(5);
                emptyCell.setPadding(10);
                emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(emptyCell);
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    @Override
    public byte[] generateCsvReport(User user, LocalDate start, LocalDate end) {
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);

        StringBuilder csv = new StringBuilder();
        csv.append("Date,Category,Description,Type,Amount\n");

        for (Transaction t : transactions) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    t.getDate().toString(),
                    t.getCategory().replace("\"", "\"\""),
                    t.getDescription().replace("\"", "\"\""),
                    t.getType().name(),
                    t.getAmount().toString()
            ));
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }
}
