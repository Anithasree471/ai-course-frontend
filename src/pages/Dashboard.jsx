import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API_BASE_URL from "../config"

function Dashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("user_id")

    if (!userId) {
      navigate("/login")
      return
    }

    fetchCourses(userId)
  }, [navigate])

  const fetchCourses = async (userId) => {
    try {
      setLoading(true)

      const res = await fetch(`${API_BASE_URL}/courses/${userId}`)
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        alert(data?.error || "Failed to fetch courses")
        return
      }

      setCourses(data?.courses || [])
    } catch (error) {
      console.error("FETCH COURSES ERROR:", error)
      alert("Error loading courses")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/course/${id}`, {
        method: "DELETE"
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        alert(data?.error || "Delete failed")
        return
      }

      setCourses((prev) => prev.filter((course) => course.id !== id))
    } catch (error) {
      console.error("DELETE ERROR:", error)
      alert("Error deleting course")
    }
  }

  return (
    <div className="container text-center mt-5 text-light">
      <h1 className="display-5 fw-bold mb-4">Your Generated Courses</h1>

      {loading ? (
        <p className="lead">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="lead">No courses generated yet.</p>
      ) : (
        <div className="row justify-content-center">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 mb-3">
              <div className="card bg-dark text-light shadow-sm border-0">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5
                    className="card-title mb-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    📘 {course.title}
                  </h5>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard