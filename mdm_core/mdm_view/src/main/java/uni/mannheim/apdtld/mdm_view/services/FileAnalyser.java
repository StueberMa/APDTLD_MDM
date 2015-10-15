package uni.mannheim.apdtld.mdm_view.services;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Writer;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opencsv.CSVReader;

public class FileAnalyser extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String filePath;
	
	
	public void init() {
		// Get the file location where it would be stored.
		filePath = getServletContext().getInitParameter("file-upload");
		new File(filePath).mkdirs();
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Writer out = response.getWriter();
		
		CSVReader reader = new CSVReader(new FileReader(filePath + request.getParameter("file")), ';');
		String[] nextLine;
		ArrayList<ArrayList<String>> sample = new ArrayList<ArrayList<String>>();
		int rowIndex = 0;
		while ((nextLine = reader.readNext()) != null && rowIndex < 10) {
			for(int columnIndex = 0; columnIndex < nextLine.length; columnIndex++) {
				out.write(sample.size() +"<="+ columnIndex + "\r\n");
				if(sample.size() <= columnIndex) {
					sample.add(new ArrayList<String>());
					out.write("add\r\n");
				}
				sample.get(columnIndex).add(nextLine[columnIndex]);
				out.write(nextLine[columnIndex]+"\r\n");
			}
			rowIndex++;
		}
		reader.close();
		
		int headerIsTextAndBodyIsNotTextCount = 0;
		int headerIsNotTextCount = 0;
		
		for(ArrayList<String> column:sample) {
			boolean headerIsText = isText(column.get(0));
			boolean bodyIsText = false;
			for(rowIndex = 1; rowIndex < column.size(); rowIndex++) {
				bodyIsText |= isText(column.get(rowIndex));
			}
			if(headerIsText && !bodyIsText) {
				headerIsTextAndBodyIsNotTextCount++;
			}
			if(!headerIsText) {
				headerIsNotTextCount++;
			}
		}
		
		if(headerIsNotTextCount>0 || headerIsTextAndBodyIsNotTextCount==0) {
			out.write("Need to set own header attributes." + headerIsTextAndBodyIsNotTextCount +","+ sample.size());
			return;
		}
		
		out.write("Identified header row");
		
	}
	
	private boolean isText(String str) {
		return !isNumber(str) && !isDate(str);
	}
	
	private boolean isNumber(String str) {
		try {  
			Double.parseDouble(str);  
		} catch(NumberFormatException nfe) {  
			return false;  
		}  
		return true;  
	}
	
	private boolean isDate(String str) {
		try {
			DateFormat.getInstance().parse(str);
		} catch(ParseException pe) {
			return false;
		}
		return true;
	}

}
