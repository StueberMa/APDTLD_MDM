package uni.mannheim.apdtld.mdm_view.services;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Basic extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		/*RequestDispatcher rd = getServletContext().getNamedDispatcher("default");

    	HttpServletRequest wrapped = new HttpServletRequestWrapper(request) {
    		public String getServletPath() { return ""; }
    	};

    	rd.forward(wrapped, response);*/
		
		response.getWriter().append("hello world");
	}
	

}
