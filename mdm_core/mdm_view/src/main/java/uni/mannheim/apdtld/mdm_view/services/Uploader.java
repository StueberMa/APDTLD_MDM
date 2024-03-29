package uni.mannheim.apdtld.mdm_view.services;

import java.io.File;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class Uploader extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private boolean isMultipart;
	private String filePath;
	private int maxMemSize = 4 * 1024;
	private File file;

	public void init() {
		// Get the file location where it would be stored.
		filePath = getServletContext().getInitParameter("file-upload");
		new File(filePath).mkdirs();
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, java.io.IOException {

		// Check that we have a file upload request
		isMultipart = ServletFileUpload.isMultipartContent(request);
		response.setContentType("text/html");
		java.io.PrintWriter out = response.getWriter();
		if (!isMultipart) {
			response.sendError(500);
			out.println("<html>");
			out.println("<head>");
			out.println("<title>Servlet upload</title>");
			out.println("</head>");
			out.println("<body>");
			out.println("<p>No file uploaded</p>");
			out.println("</body>");
			out.println("</html>");
			return;
		}
		
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// maximum size that will be stored in memory
		factory.setSizeThreshold(maxMemSize);
		// Location to save data that is larger than maxMemSize.
		factory.setRepository(new File(filePath));

		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload(factory);
		// maximum file size to be uploaded.
		//upload.setSizeMax(maxFileSize);

		try {
			// Parse the request to get file items.
			List<FileItem> fileItems = upload.parseRequest(request);
			
			

			// Process the uploaded file items
			Iterator<FileItem> i = fileItems.iterator();
			
			ServletContext context = getServletContext();
	
			while (i.hasNext()) {
				FileItem fi = (FileItem) i.next();
				//if (!fi.isFormField()) {
					// Get the uploaded file parameters
					String fileName = fi.getName();
					if(fileName==null) {
						continue;
					}
					// Write the file
					if (fileName.lastIndexOf("\\") >= 0) {
						file = new File(filePath + fileName.substring(fileName.lastIndexOf("\\")));
					} else {
						file = new File(filePath + fileName.substring(fileName.lastIndexOf("\\") + 1));
					}
					fi.write(file);
					out.write(fileName);
				//}
			}

		} catch (Exception ex) {
			System.out.println(ex);
			//out.println(ex.getLocalizedMessage());
		}
		
		/*JsonObject wrapper = new JsonObject();
		wrapper.addProperty("filenames", filenames.substring(0, filenames.length()-2));
		out.write(wrapper.toString());*/
	}

}
