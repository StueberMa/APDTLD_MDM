package uni.mannheim.apdtld.mdm_view.services;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import uni.mannheim.apdtld.mdm_view.odata.JpaEntityManagerFactory;

/**
 * Servlet for simple JPA queries.
 * 
 * @author APDTLD_MDM @ Uni Mannheim
 * @version 22.10.2015
 */
public class JPAInfo extends HttpServlet {

	// constants
	private static final long serialVersionUID = 1L;
	private static final int ERROR_INTERNAL = 1;
	private static final int ERROR_NOT_FOUND = 2;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		// declaration
		EntityManager em = null;
		JsonObject json = null;
		PrintWriter out = null;

		// initialization
		json = new JsonObject();
		out = resp.getWriter();

		// set response
		resp.setStatus(200);
		resp.setContentType("application/json");

		// connect to JPA
		try {
			em = JpaEntityManagerFactory.getEntityManagerFactory("data_model").createEntityManager();
		} catch (NamingException | SQLException e) {
			reportError(ERROR_INTERNAL, resp);
			return;
		}

		// handle dispatcher path
		if (req.getPathInfo().equals("/count")) {

			// local declaration
			long value = 0;

			// customer
			value = (Long) em.createQuery("SELECT count(distinct c) FROM Customer c").getSingleResult();
			json.addProperty("customers", value);

			// products
			value = (Long) em.createQuery("SELECT count(distinct p) FROM Product p").getSingleResult();
			json.addProperty("products", value);

			// campaign
			value = (Long) em.createQuery("SELECT count(distinct c) FROM Campaign c").getSingleResult();
			json.addProperty("campaigns", value);

			// lead
			value = (Long) em.createQuery("SELECT count(distinct l) FROM Lead l").getSingleResult();
			json.addProperty("leads", value);

			out.print(json.toString());
			out.close();

			return;
			
		} else if (req.getPathInfo().equals("/active")) {

			// local declaration
			JsonObject locObj = null;
			long active = 0;
			long total = 0;

			// campaign
			locObj = new JsonObject();
			total = (Long) em.createQuery("SELECT count(distinct c) FROM Campaign c").getSingleResult();
			locObj.addProperty("total", total);
			
			active = (Long) em.createQuery("SELECT count(distinct c) FROM Campaign c WHERE c.status = 'ACTIVE'").getSingleResult();
			locObj.addProperty("active", active);
			json.add("campaign", locObj);

			// lead
			locObj = new JsonObject();
			total = (Long) em.createQuery("SELECT count(distinct l) FROM Lead l").getSingleResult();
			locObj.addProperty("total", total);
			
			active = (Long) em.createQuery("SELECT count(distinct l) FROM Lead l WHERE l.status = 'OPEN'").getSingleResult();
			locObj.addProperty("active", active);
			json.add("lead", locObj);

			out.print(json.toString());
			out.close();
		} else if (req.getPathInfo().equals("/debugLeads")) {

			// local declaration
			Object result = null;
			Gson gson = null;
			
			gson = new Gson();
			result = em.createQuery("SELECT l FROM Lead l").getResultList();
			
			out.print(gson.toJson(result));
			out.close();
		}

		// no handler found
		reportError(ERROR_NOT_FOUND, resp);
	}

	/**
	 * Method to report error
	 * 
	 * @param type
	 * @param resp
	 */
	private void reportError(int type, HttpServletResponse resp) throws ServletException, IOException {

		// declaration
		JsonObject json = null;
		PrintWriter out = null;

		// initialization
		json = new JsonObject();
		out = resp.getWriter();

		// handle according to type
		switch (type) {
		case ERROR_INTERNAL:
			resp.setStatus(500);
			json.addProperty("error", "Internal server error");
			break;

		case ERROR_NOT_FOUND:
			resp.setStatus(404);
			json.addProperty("error", "Service not found");
			break;
		}

		out.print(json.toString());
		out.close();
	}
}
