$(document).ready(function() {
    $('.delete-article').on('click', function(e) {
      $target = $(e.target);
      const id = $target.attr('data-id');
      $.ajax({
        type: 'DELETE',
        url: '/article/'+id,
        success: (res) => {
            alert('Article Deleted! ;)');
            window.location.href='/';
        },
        error: (err) => {
            console.log(err);
        }
      });
    });
});