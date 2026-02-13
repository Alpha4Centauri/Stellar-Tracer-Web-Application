import uuid
import threading

JOBS = {}

def create_job():
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {"status": "pending", "result": None, "error": None}
    return job_id

def set_job_running(job_id):
    JOBS[job_id]["status"] = "running"

def set_job_result(job_id, result):
    JOBS[job_id]["status"] = "completed"
    JOBS[job_id]["result"] = result

def set_job_error(job_id, error):
    JOBS[job_id]["status"] = "error"
    JOBS[job_id]["error"] = str(error)

def get_job(job_id):
    return JOBS.get(job_id)

def run_async(job_id, target, *args, **kwargs):
    def wrapper():
        try:
            set_job_running(job_id)
            result = target(*args, **kwargs)
            set_job_result(job_id, result)
        except Exception as e:
            set_job_error(job_id, e)

    thread = threading.Thread(target=wrapper)
    thread.start()