using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Middlewares;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [FirebaseAuth]

    public class ReportController : ControllerBase
    {
        private readonly ReportService _reportService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public ReportController(ReportService reportService, FirebaseAuthService firebaseAuthService)
        {
            _reportService = reportService;
            _firebaseAuthService = firebaseAuthService;
        }

        // Route: GET /Report/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetReportById(string id)
        {
            var report = await _reportService.GetReportAsync(id);
            if (report == null) return NotFound();
            return Ok(report);
        }

        // Route: GET /Report/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Report>>> GetAllReports()
        {
            var reports = await _reportService.GetAllReportsAsync();
            return Ok(reports);
        }


        [HttpGet("community/{communityId}")]
        public async Task<ActionResult<IEnumerable<Report>>> GetAllByCommunity(string communityId)
        {
            // Get reports by community using the ReportService
            var reports = await _reportService.GetReportsByCommunityAsync(communityId);

            // Return the filtered reports
            return Ok(reports);
        }


        // Route: POST /Report
        [HttpPost]
        public async Task<IActionResult> CreateReport([FromBody] Report report)
        {
            // Fetch the reporter ID from the Firebase Authentication service
            string reporterId = _firebaseAuthService.GetUserId();

            if (report == null)
            {
                return BadRequest("Report cannot be null.");
            }


            try
            {
                // Call the service method to add the report
                await _reportService.AddReportAsync(reporterId,report);
                return CreatedAtAction(nameof(GetReportById), new { id = report.Id }, report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Route: DELETE /Report/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(string id)
        {
            var existingReport = await _reportService.GetReportAsync(id);
            if (existingReport == null) return NotFound();

            await _reportService.DeleteReportAsync(id);
            return NoContent();
        }
    }
}
